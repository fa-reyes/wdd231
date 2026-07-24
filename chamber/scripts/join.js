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

function setupTimestamp() {
    const timestampField = document.getElementById("timestamp");
    timestampField.value = new Date().toISOString();
}

function setupModals() {
    const cardLinks = document.querySelectorAll(".card-link");

    cardLinks.forEach((link) => {
        link.addEventListener("click", () => {
            const modalId = link.getAttribute("data-modal");
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.showModal();
            }
        });
    });

    const dialogs = document.querySelectorAll(".membership-modal");

    dialogs.forEach((dialog) => {
        const closeBtn = dialog.querySelector(".modal-close");
        closeBtn.addEventListener("click", () => dialog.close());

        // Close when clicking the backdrop
        dialog.addEventListener("click", (event) => {
            if (event.target === dialog) {
                dialog.close();
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupNavToggle();
    setupFooterDates();
    setupTimestamp();
    setupModals();
});