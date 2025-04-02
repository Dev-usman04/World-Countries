const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const searchedCountry = document.getElementById("searched-country");
const neighborCountry = document.getElementById("neighbor-country");
const countryContainer = document.querySelector(".country"); // Ensure correct visibility

async function fetchCountryData(country) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
        const data = await response.json();
        if (!response.ok) throw new Error("Country not found");
        return data[0];
    } catch (error) {
        searchedCountry.innerHTML = `<p class='error'>${error.message}</p>`;
        return null;
    }
}

async function displayCountryInfo(country) {
    searchedCountry.innerHTML = "<p>Loading...</p>";
    neighborCountry.innerHTML = "";
    const countryData = await fetchCountryData(country);
    if (!countryData) return;

    const { flags, name, population, languages, currencies, borders } = countryData;
    const language = Object.values(languages)[0] || "N/A";
    const currency = currencies ? Object.values(currencies)[0].name : "N/A";

    searchedCountry.innerHTML = `
        <div class="country-box">
            <h2>${name.common}</h2>
            <img src="${flags.png}" alt="Flag of ${name.common}" />
            <div class="info"><i class="fas fa-users"></i><span>Population: ${population.toLocaleString()}</span></div>
            <div class="info"><i class="fas fa-language"></i><span>Language: ${language}</span></div>
            <div class="info"><i class="fas fa-money-bill-wave"></i><span>Currency: ${currency}</span></div>
        </div>
    `;

    // Fetch and display neighboring country
    if (borders && borders.length > 0) {
        try {
            const neighborCode = borders[0]; // First neighboring country
            const neighborResponse = await fetch(`https://restcountries.com/v3.1/alpha/${neighborCode}`);
            const neighborData = await neighborResponse.json();
            const neighborCountryData = neighborData[0];

            neighborCountry.innerHTML = `
                <div class="country-box">
                    <h3>Neighboring Country: ${neighborCountryData.name.common}</h3>
                    <img src="${neighborCountryData.flags.png}" alt="Flag of ${neighborCountryData.name.common}" />
                    <div class="info"><i class="fas fa-users"></i><span>Population: ${neighborCountryData.population.toLocaleString()}</span></div>
                    <div class="info"><i class="fas fa-language"></i><span>Language: ${Object.values(neighborCountryData.languages)[0]}</span></div>
                    <div class="info"><i class="fas fa-money-bill-wave"></i><span>Currency: ${Object.values(neighborCountryData.currencies)[0].name}</span></div>
                </div>
            `;
        } catch (error) {
            neighborCountry.innerHTML = `<p class='error'>Neighboring country data not available</p>`;
        }
    } else {
        neighborCountry.innerHTML = `<p class='error'>No neighboring countries</p>`;
    }

    // Show the countries container and background
    document.body.classList.add("loaded");
    countryContainer.classList.add("loaded");
}

searchButton.addEventListener("click", () => {
    const country = searchInput.value.trim();
    if (country) displayCountryInfo(country);
});

searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        const country = searchInput.value.trim();
        if (country) displayCountryInfo(country);
    }
});
