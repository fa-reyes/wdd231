const STORAGE_FAV = "hoophistory-favorite-team";
const DATA_URL = "data/teams.json";

let teamsData = [];
let currentFilter = "All";
let lastFocusedElement = null;

async function loadTeams() {
    const grid = document.querySelector("#teams-grid");
    try {
        const response = await fetch(DATA_URL);
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }
        teamsData = await response.json();
        renderTeams();
    } catch (error) {
        console.error("Failed to load team data:", error);
        grid.innerHTML = `<p class="status-msg">We couldn't load the team list right now. Please refresh the page and try again.</p>`;
    }
}

function getFavoriteId() {
    return localStorage.getItem(STORAGE_FAV);
}

function toggleFavorite(teamId) {
    const current = getFavoriteId();
    try {
        if (current === String(teamId)) {
            localStorage.removeItem(STORAGE_FAV);
        } else {
            localStorage.setItem(STORAGE_FAV, String(teamId));
        }
    } catch (error) {
        console.warn("Could not save favorite team:", error);
    }
}

function renderTeams() {
    const grid = document.querySelector("#teams-grid");
    const countEl = document.querySelector("#results-count");
    const favId = getFavoriteId();

    const filtered =
        currentFilter === "All"
            ? teamsData
            : teamsData.filter((team) => team.conference === currentFilter);

    grid.innerHTML = filtered
        .map((team) => {
            const isFav = favId === String(team.id);
            return `
                <article class="team-tile" style="--team-color:${team.color}" data-id="${team.id}" tabindex="0" role="button" aria-haspopup="dialog" aria-label="View details for ${team.name}">
                    <button type="button" class="fav-star" data-id="${team.id}" aria-pressed="${isFav}" aria-label="${isFav ? "Remove" : "Mark"} ${team.name} as favorite team">${isFav ? "★" : "☆"}</button>
                    <span class="abbr">${team.abbreviation}</span>
                    <span class="name">${team.name}</span>
                    <span class="meta">${team.conference} &middot; ${team.division} Division &middot; Est. ${team.founded}</span>
                </article>
            `;
        })
        .join("");

    if (countEl) {
        countEl.textContent = `${filtered.length} team${filtered.length === 1 ? "" : "s"}`;
    }
}

function openModal(teamId) {
    const team = teamsData.find((t) => String(t.id) === String(teamId));
    if (!team) return;

    lastFocusedElement = document.activeElement;

    const backdrop = document.querySelector("#team-dialog");
    const modal = backdrop.querySelector(".dialog-panel");
    const legendsMarkup = team.legends.map((player) => `<li>${player}</li>`).join("");

    modal.style.setProperty("--team-color", team.color);
    backdrop.querySelector("#dialog-title").textContent = team.name;
    backdrop.querySelector("#dialog-body").innerHTML = `
        <p>${team.blurb}</p>
        <dl>
            <dt>Conference</dt><dd>${team.conference}</dd>
            <dt>Division</dt><dd>${team.division} Division</dd>
            <dt>Founded</dt><dd>${team.founded}</dd>
            <dt>Home arena</dt><dd>${team.arena}</dd>
        </dl>
        <p>Franchise legends</p>
        <ul class="legends">${legendsMarkup}</ul>
    `;

    backdrop.classList.add("is-open");
    document.body.style.overflow = "hidden";
    backdrop.querySelector(".dialog-dismiss").focus();
    document.addEventListener("keydown", handleModalKeydown);
}

function closeModal() {
    const backdrop = document.querySelector("#team-dialog");
    backdrop.classList.remove("is-open");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", handleModalKeydown);
    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
}

function handleModalKeydown(event) {
    if (event.key === "Escape") {
        closeModal();
    }
}

function handleGridClick(event) {
    const starBtn = event.target.closest(".fav-star");
    if (starBtn) {
        event.stopPropagation();
        toggleFavorite(starBtn.dataset.id);
        renderTeams();
        return;
    }

    const card = event.target.closest(".team-tile");
    if (card) {
        openModal(card.dataset.id);
    }
}

function handleGridKeydown(event) {
    const card = event.target.closest(".team-tile");
    if (card && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        openModal(card.dataset.id);
    }
}

function initFilters() {
    const filterBar = document.querySelector("#filter-bar");
    filterBar.addEventListener("click", (event) => {
        const btn = event.target.closest(".filter-chip");
        if (!btn) return;
        filterBar
            .querySelectorAll(".filter-chip")
            .forEach((b) => b.setAttribute("aria-pressed", "false"));
        btn.setAttribute("aria-pressed", "true");
        currentFilter = btn.dataset.filter;
        renderTeams();
    });
}

function initModal() {
    const backdrop = document.querySelector("#team-dialog");
    backdrop.querySelector(".dialog-dismiss").addEventListener("click", closeModal);
    backdrop.addEventListener("click", (event) => {
        if (event.target === backdrop) closeModal();
    });
}

function initTeams() {
    const grid = document.querySelector("#teams-grid");
    if (!grid) return;
    grid.addEventListener("click", handleGridClick);
    grid.addEventListener("keydown", handleGridKeydown);
    initFilters();
    initModal();
    loadTeams();
}