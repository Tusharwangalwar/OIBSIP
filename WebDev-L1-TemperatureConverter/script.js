
const form = document.getElementById("converter-form");
const temperatureInput = document.getElementById("temperature");
const unitSelect = document.getElementById("unit");
const errorMessage = document.getElementById("error-message");

const celsiusResult = document.getElementById("celsius-result");
const fahrenheitResult = document.getElementById("fahrenheit-result");
const kelvinResult = document.getElementById("kelvin-result");

const ABSOLUTE_ZERO_C = -273.15;
const ABSOLUTE_ZERO_F = -459.67;
const ABSOLUTE_ZERO_K = 0;

function formatTemperature(value) {
    // Avoid displaying negative zero caused by floating-point rounding.
    const rounded = Math.abs(value) < 0.0000001 ? 0 : value;
    return rounded.toFixed(2);
}

function clearResults() {
    celsiusResult.textContent = "—";
    fahrenheitResult.textContent = "—";
    kelvinResult.textContent = "—";
}

function showError(message) {
    errorMessage.textContent = message;
    clearResults();
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    errorMessage.textContent = "";

    const rawValue = temperatureInput.value.trim();
    const temperature = Number(rawValue);
    const unit = unitSelect.value;

    // Check for empty input and invalid numbers.
    if (rawValue === "" || !Number.isFinite(temperature)) {
        showError("Please enter a valid numeric temperature.");
        return;
    }

    // Validate absolute zero for the selected input unit.
    if (
        (unit === "C" && temperature < ABSOLUTE_ZERO_C) ||
        (unit === "F" && temperature < ABSOLUTE_ZERO_F) ||
        (unit === "K" && temperature < ABSOLUTE_ZERO_K)
    ) {
        showError("Temperature cannot be below absolute zero.");
        return;
    }

    let celsius;

    // Convert the input value to Celsius.
    if (unit === "C") {
        celsius = temperature;
    } else if (unit === "F") {
        celsius = (temperature - 32) * 5 / 9;
    } else if (unit === "K") {
        celsius = temperature - 273.15;
    } else {
        showError("Please select a valid temperature unit.");
        return;
    }

    // Calculate the other units from Celsius.
    const fahrenheit = (celsius * 9 / 5) + 32;
    const kelvin = celsius + 273.15;

    // Display all results.
    celsiusResult.textContent = formatTemperature(celsius) + " °C";
    fahrenheitResult.textContent = formatTemperature(fahrenheit) + " °F";
    kelvinResult.textContent = formatTemperature(kelvin) + " K";
});
