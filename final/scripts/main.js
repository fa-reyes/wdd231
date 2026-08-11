import { initTheme } from "./theme.js";
import { initNav } from "./nav.js";

function setFooterYear() {
    const yearEl = document.querySelector("#year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

async function initPageFeatures() {
    if (document.querySelector("#teams-grid")) {
        const { initTeams } = await import("./teams.js");
        initTeams();
    }
 
    if (document.querySelector("#contact-form")) {
        const { initForm } = await import("./form.js");
        initForm();
    }
 
    if (document.querySelector("#submission-output")) {
        const { initAction } = await import("./action.js");
        initAction();
    }
}
 
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initNav();
    setFooterYear();
    initPageFeatures();
});