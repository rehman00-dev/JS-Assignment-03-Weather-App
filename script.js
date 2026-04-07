const apiKey = "b2680e4e2e34f960b8a05c777af155f3"; // Replace with your actual API Key
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const weatherCard = document.getElementById("weather-card");
const loadingTxt = document.getElementById("loading");
const errorMsg = document.getElementById("error-msg");

async function checkWeather(city) {
    // Reset UI states
    loadingTxt.classList.remove("hidden");
    errorMsg.classList.add("hidden");
    weatherCard.classList.add("hidden");

    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                errorMsg.innerText = "City not found. Try again.";
            } else if (response.status === 401) {
                errorMsg.innerText = "Invalid API Key. It might still be activating (wait 30-60 mins).";
            } else {
                errorMsg.innerText = "An error occurred. Please try later.";
            }
            errorMsg.classList.remove("hidden");
            loadingTxt.classList.add("hidden");
            return;
        }

        const data = await response.json();

        // Update basic info
        document.getElementById("city-name").innerText = data.name;
        document.getElementById("temperature").innerText = Math.round(data.main.temp) + "°C";
        document.getElementById("humidity").innerText = data.main.humidity + "%";
        document.getElementById("wind-speed").innerText = data.wind.speed + " km/h";
        document.getElementById("description").innerText = data.weather[0].description;
        
        // Bonus: Min/Max and Date
        document.getElementById("min-max").innerText = 
            `${Math.round(data.main.temp_min)}°C / ${Math.round(data.main.temp_max)}°C`;
        
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        document.getElementById("current-date").innerText = new Date().toLocaleDateString('en-US', options);

        // Icon update
        const iconCode = data.weather[0].icon;
        document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        // Dynamic Background based on weather
        updateBackground(data.weather[0].main);

        // Show card, hide loading
        loadingTxt.classList.add("hidden");
        weatherCard.classList.remove("hidden");
        cityInput.value = ""; // Clear input

    } catch (error) {
        console.error("Error fetching data:", error);
        loadingTxt.classList.add("hidden");
    }
}

function updateBackground(condition) {
    const body = document.body;
    switch (condition) {
        case "Clear":
            body.style.background = "linear-gradient(135deg, #FFD194 0%, #70e1f5 100%)";
            break;
        case "Rain":
        case "Drizzle":
            body.style.background = "linear-gradient(135deg, #373B44 0%, #4286f4 100%)";
            break;
        case "Clouds":
            body.style.background = "linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)";
            break;
        default:
            body.style.background = "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)";
            body.style.backgroundSize = "400% 400%";
    }
}

// Event Listeners
searchBtn.addEventListener("click", () => {
    if (cityInput.value.trim() !== "") {
        checkWeather(cityInput.value);
    }
});

cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        if (cityInput.value.trim() !== "") {
            checkWeather(cityInput.value);
        }
    }
});
