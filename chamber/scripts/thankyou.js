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

function formatTimestamp(rawValue) {
    const parsed = new Date(rawValue);

    if (Number.isNaN(parsed.getTime())) {
        return rawValue || "—";
    }

    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
        timeStyle: "short",
    }).format(parsed);
}

function showSubmittedData() {
    const params = new URLSearchParams(window.location.search);

    const fieldMap = {
        outFirstName: "firstName",
        outLastName: "lastName",
        outEmail: "email",
        outMobile: "mobile",
        outBusinessName: "businessName",
    };

    Object.entries(fieldMap).forEach(([elementId, paramName]) => {
        const el = document.getElementById(elementId);
        el.textContent = params.get(paramName) || "—";
    });

    const timestampEl = document.getElementById("outTimestamp");
    timestampEl.textContent = formatTimestamp(params.get("timestamp"));
}

document.addEventListener("DOMContentLoaded", () => {
    setupNavToggle();
    setupFooterDates();
    showSubmittedData();
});