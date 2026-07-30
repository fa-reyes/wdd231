import discoverItems from "../data/discover.mjs";

function renderCards(items) {
    const grid = document.getElementById("discoverGrid");
    grid.innerHTML = "";

    items.forEach((item, index) => {
        const card = document.createElement("article");
        card.className = `discover-card item-${index + 1}`;

        card.innerHTML = `
            <figure>
                <img src="${item.image}" alt="${item.name}" loading="lazy" width="300" height="200">
            </figure>
            <div class="discover-card-body">
                <h2>${item.name}</h2>
                <address>${item.address}</address>
                <p>${item.description}</p>
                <button type="button" class="discover-btn" data-id="${item.id}">Learn more</button>
            </div>
        `;

        grid.appendChild(card);
    });
}

function setupLearnMore(items) {
    const modal = document.getElementById("discoverModal");
    const modalTitle = document.getElementById("discoverModalTitle");
    const modalImg = document.getElementById("discoverModalImg");
    const modalAddress = document.getElementById("discoverModalAddress");
    const modalDesc = document.getElementById("discoverModalDesc");
    const closeBtn = document.getElementById("discoverModalClose");

    document.getElementById("discoverGrid").addEventListener("click", (event) => {
        const button = event.target.closest(".discover-btn");
        if (!button) return;

        const item = items.find((entry) => entry.id === button.dataset.id);
        if (!item) return;

        modalTitle.textContent = item.name;
        modalImg.src = item.image;
        modalImg.alt = item.name;
        modalAddress.textContent = item.address;
        modalDesc.textContent = item.description;
        modal.showModal();
    });

    closeBtn.addEventListener("click", () => modal.close());
}

function showVisitMessage() {
    const banner = document.getElementById("visitMessage");
    const text = document.getElementById("visitMessageText");
    const closeBtn = document.getElementById("visitMessageClose");
    const now = Date.now();
    const lastVisit = localStorage.getItem("discoverLastVisit");

    let message;

    if (!lastVisit) {
        message = "Welcome! Let us know if you have any questions.";
    } else {
        const msPerDay = 1000 * 60 * 60 * 24;
        const elapsedMs = now - Number(lastVisit);
        const elapsedDays = Math.floor(elapsedMs / msPerDay);

        if (elapsedMs < msPerDay) {
            message = "Back so soon! Awesome!";
        } else if (elapsedDays === 1) {
            message = "You last visited 1 day ago.";
        } else {
            message = `You last visited ${elapsedDays} days ago.`;
        }
    }

    localStorage.setItem("discoverLastVisit", String(now));

    text.textContent = message;
    closeBtn.addEventListener("click", () => banner.classList.add("hidden"));
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
    setupFooterDates();
    renderCards(discoverItems);
    setupLearnMore(discoverItems);
    showVisitMessage();
});
