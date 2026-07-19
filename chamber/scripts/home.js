const weekdayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });

async function loadWeather() {
    const weatherEl = document.getElementById("weather");

    try {
        const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=-23.65&lon=-70.39&units=metric&appid=fb1cbba1bcdc9e7ff2147084cc617c67`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=-23.65&lon=-70.39&units=metric&appid=fb1cbba1bcdc9e7ff2147084cc617c67`;

        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentUrl),
            fetch(forecastUrl),
        ]);

        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error("Network response was not ok");
        }

        const current = await currentResponse.json();
        const forecast = await forecastResponse.json();

        renderWeather(current, forecast);
    } catch (error) {
        weatherEl.innerHTML = `<p class="loading">Sorry, the weather could not be loaded right now.</p>`;
        console.error("Error loading weather:", error);
    }
}

function renderWeather(current, forecast) {
    const weatherEl = document.getElementById("weather");

    const temp = Math.round(current.main.temp);
    const description = current.weather[0].description;
    const icon = current.weather[0].icon;

    const dailyForecast = getThreeDayForecast(forecast.list);

    const forecastHTML = dailyForecast
        .map(
            (day) => `
        <div class="forecast-day">
            <p class="forecast-label">${day.label}</p>
            <img src="https://openweathermap.org/img/wn/${day.icon}.png" alt="${day.description}" width="60" height="60">
            <p class="forecast-temp">${day.temp}&deg;C</p>
        </div>`
        )
        .join("");

    weatherEl.innerHTML = `
        <div class="weather-current">
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" width="70" height="70">
            <div>
                <p class="weather-temp">${temp}&deg;C</p>
                <p class="weather-desc">${description}</p>
            </div>
        </div>
        <div class="weather-forecast">
            ${forecastHTML}
        </div>
    `;
}

function getThreeDayForecast(list) {
    const todayString = new Date().toDateString();
    const byDate = {};

    list.forEach((entry) => {
        const entryDate = new Date(entry.dt * 1000);
        const dateKey = entryDate.toDateString();

        if (dateKey === todayString) return;

        const hour = entryDate.getHours();
        if (!byDate[dateKey] || Math.abs(hour - 12) < Math.abs(byDate[dateKey].hour - 12)) {
            byDate[dateKey] = {
                hour,
                date: entryDate,
                temp: Math.round(entry.main.temp),
                icon: entry.weather[0].icon,
                description: entry.weather[0].description,
            };
        }
    });

    return Object.values(byDate)
        .slice(0, 3)
        .map((day) => ({
            label: weekdayFormatter.format(day.date),
            temp: day.temp,
            icon: day.icon,
            description: day.description,
        }));
}

const membershipLabels = {
    1: "Member",
    2: "Silver",
    3: "Gold",
};

async function loadSpotlights() {
    const spotlightsEl = document.getElementById("spotlights");

    try {
        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error(`Network response was not ok (${response.status})`);
        }

        const data = await response.json();
        renderSpotlights(data.members);
    } catch (error) {
        spotlightsEl.innerHTML = `<p class="loading">Sorry, member spotlights could not be loaded right now.</p>`;
        console.error("Error loading members.json:", error);
    }
}

function renderSpotlights(members) {
    const spotlightsEl = document.getElementById("spotlights");

    const eligible = members.filter((member) => member.membership === 2 || member.membership === 3);
    const chosen = pickRandom(eligible, 3);

    spotlightsEl.innerHTML = "";

    chosen.forEach((member) => {
        const levelLabel = membershipLabels[member.membership] || "Member";

        const card = document.createElement("article");
        card.className = "spotlight-card";
        card.innerHTML = `
            <img src="${member.image}" alt="${member.name} logo" loading="lazy" width="400" height="300">
            <div class="spotlight-body">
                <div class="spotlight-top">
                    <h3>${member.name}</h3>
                    <span class="badge badge-${member.membership}">${levelLabel}</span>
                </div>
                <p class="spotlight-meta">${member.address}</p>
                <p class="spotlight-meta">${member.phone}</p>
                <a href="${member.url}" target="_blank" rel="noopener">Visit website</a>
            </div>
        `;
        spotlightsEl.appendChild(card);
    });
}

function pickRandom(array, count) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, count);
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
    loadWeather();
    loadSpotlights();
});
