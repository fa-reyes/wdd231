const currentYearEl = document.getElementById('currentyear');
const lastModifiedEl = document.getElementById('lastModified');

const currentYear = new Date().getFullYear();
currentYearEl.textContent = currentYear;

lastModifiedEl.textContent = `Last Modification: ${document.lastModified}`;