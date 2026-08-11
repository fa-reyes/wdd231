import { initTheme } from "./theme.js";
import { initNav } from "./nav.js";

function setFooterYear() {
    const yearEl = document.querySelector("#year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initNav();
    setFooterYear();
});