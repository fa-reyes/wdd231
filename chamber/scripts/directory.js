const membershipLabels = {
    1: "Member",
    2: "Silver",
    3: "Gold",
};

async function loadMembers() {
    const directory = document.getElementById("directory");

    try {
        const response = await fetch("data/members.json");

        if (!response.ok) {
        throw new Error(`Network response was not ok (${response.status})`);
        }

        const data = await response.json();
        renderMembers(data.members);
    } catch (error) {
        directory.innerHTML = `<p class="loading">Sorry, the member directory could not be loaded right now.</p>`;
        console.error("Error loading members.json:", error);
    }
}

function renderMembers(members) {
    const directory = document.getElementById("directory");
    directory.innerHTML = "";

    members.forEach((member) => {
        const card = document.createElement("article");
        card.className = "member-card";

        const level = member.membership;
        const levelLabel = membershipLabels[level] || "Member";

        card.innerHTML = `
            <img src="${member.image}" alt="${member.name} logo" loading="lazy" width="400" height="300">
            <div class="member-card-body">
                <div class="member-card-top">
                    <h3>${member.name}</h3>
                    <span class="badge badge-${level}">${levelLabel}</span>
                </div>
                <p class="member-category">${member.category}</p>
                <p class="member-tagline">${member.tagline}</p>
                <div class="member-meta">
                    <span>${member.address}</span>
                    <span>${member.phone}</span>
                    <a href="${member.url}" target="_blank" rel="noopener">Visit website</a>
                </div>
            </div>
        `;

        directory.appendChild(card);
    });
}

function setupViewToggle() {
    const directory = document.getElementById("directory");
    const gridBtn = document.getElementById("gridBtn");
    const listBtn = document.getElementById("listBtn");

    function applyView(view) {
        if (view === "list") {
            directory.classList.remove("grid-view");
            directory.classList.add("list-view");
            listBtn.classList.add("active");
            gridBtn.classList.remove("active");
            listBtn.setAttribute("aria-pressed", "true");
            gridBtn.setAttribute("aria-pressed", "false");
        } else {
            directory.classList.remove("list-view");
            directory.classList.add("grid-view");
            gridBtn.classList.add("active");
            listBtn.classList.remove("active");
            gridBtn.setAttribute("aria-pressed", "true");
            listBtn.setAttribute("aria-pressed", "false");
        }
        localStorage.setItem("directoryView", view);
    }

    gridBtn.addEventListener("click", () => applyView("grid"));
    listBtn.addEventListener("click", () => applyView("list"));

    const savedView = localStorage.getItem("directoryView") || "grid";
    applyView(savedView);
}

function setupNavToggle() {
    const menuToggle = document.getElementById("menuToggle");
    const primaryNav = document.getElementById("primaryNav");

    menuToggle.addEventListener("click", () => {
        const isOpen = primaryNav.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", isOpen);
    });
}

function setupFooterDates() {
    document.getElementById("year").textContent = new Date().getFullYear();
    document.getElementById("lastModified").textContent = document.lastModified;
}

document.addEventListener("DOMContentLoaded", () => {
    setupNavToggle();
    setupViewToggle();
    setupFooterDates();
    loadMembers();
});