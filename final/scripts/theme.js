const STORAGE_KEY = "hoophistory-theme";

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const toggle = document.querySelector(".theme-toggle");
    if (toggle) {
        const isLight = theme === "light";
        toggle.setAttribute("aria-pressed", String(isLight));
        toggle.textContent = isLight ? "🌙" : "☀️";
        toggle.setAttribute(
            "aria-label",
            isLight ? "Switch to dark theme" : "Switch to light theme"
        );
    }
}
    
export function initTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const startingTheme = saved === "light" ? "light" : "dark";
    applyTheme(startingTheme);
    
    const toggle = document.querySelector(".theme-toggle");
    if (!toggle) return;
    
    toggle.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme");
        const next = current === "light" ? "dark" : "light";
        applyTheme(next);
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch (error) {
            console.warn("Could not save theme preference:", error);
        }
    });
}