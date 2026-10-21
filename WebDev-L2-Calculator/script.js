
const display = document.getElementById("display");
const previousDisplay = document.getElementById("previous-display");
const errorMessage = document.getElementById("error-message");
const buttons = document.getElementById("calculator-buttons");

let currentInput = "0";
let storedValue = null;
let pendingOperator = null;
let waitingForOperand = false;
let justCalculated = false;

function updateDisplay() {
    display.textContent = currentInput;
}

function showError(message) {
    errorMessage.textContent = message;
}

function clearError() {
    errorMessage.textContent = "";
}

function clearAll() {
    currentInput = "0";
    storedValue = null;
    pendingOperator = null;
    waitingForOperand = false;
    justCalculated = false;

    previousDisplay.textContent = "";
    clearError();
    updateDisplay();
}

function inputNumber(number) {
    clearError();

    if (waitingForOperand || justCalculated) {
        currentInput = number;
        waitingForOperand = false;
        justCalculated = false;
    } else if (currentInput === "0") {
        currentInput = number;
    } else if (currentInput === "-0") {
        currentInput = "-" + number;
    } else {
        currentInput += number;
    }

    updateDisplay();
}

function inputDecimal() {
    clearError();

    if (waitingForOperand || justCalculated) {
        currentInput = "0.";
        waitingForOperand = false;
        justCalculated = false;
    } else if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    updateDisplay();
}

function calculate(first, second, operator) {
    switch (operator) {
        case "+":
            return first + second;
        case "-":
            return first - second;
        case "*":
            return first * second;
        case "/":
            if (second === 0) {
                return null;
            }
            return first / second;
        default:
            return second;
    }
}

function formatResult(value) {
    if (!Number.isFinite(value)) {
        return null;
    }

    if (Object.is(value, -0)) {
        value = 0;
    }

    // Limit floating-point display noise.
    return Number(value.toPrecision(12)).toString();
}

function chooseOperator(nextOperator) {
    clearError();

    const inputValue = Number(currentInput);

    if (!Number.isFinite(inputValue)) {
        showError("Invalid number.");
        return;
    }

    if (pendingOperator && !waitingForOperand) {
        const result = calculate(storedValue, inputValue, pendingOperator);

        if (result === null) {
            showError("Cannot divide by zero.");
            return;
        }

        const formatted = formatResult(result);

        if (formatted === null) {
            showError("Result is outside the supported range.");
            return;
        }

        currentInput = formatted;
        storedValue = result;
        updateDisplay();
    } else {
        storedValue = inputValue;
    }

    pendingOperator = nextOperator;
    waitingForOperand = true;
    justCalculated = false;
    previousDisplay.textContent = `${currentInput} ${nextOperator}`;
}

function performEquals() {
    clearError();

    if (pendingOperator === null || waitingForOperand) {
        return;
    }

    const first = storedValue;
    const second = Number(currentInput);
    const operator = pendingOperator;

    const result = calculate(first, second, operator);

    if (result === null) {
        showError("Cannot divide by zero.");
        return;
    }

    const formatted = formatResult(result);

    if (formatted === null) {
        showError("Result is outside the supported range.");
        return;
    }

    previousDisplay.textContent =
        `${formatResult(first)} ${operator} ${formatResult(second)} =`;

    currentInput = formatted;
    storedValue = null;
    pendingOperator = null;
    waitingForOperand = true;
    justCalculated = true;

    updateDisplay();
}

function backspace() {
    clearError();

    if (waitingForOperand || justCalculated) {
        return;
    }

    if (currentInput.length <= 1 ||
        (currentInput.length === 2 && currentInput.startsWith("-"))) {
        currentInput = "0";
    } else {
        currentInput = currentInput.slice(0, -1);
    }

    updateDisplay();
}

function toggleSign() {
    clearError();

    if (currentInput === "0") {
        return;
    }

    currentInput = currentInput.startsWith("-")
        ? currentInput.slice(1)
        : "-" + currentInput;

    updateDisplay();
}

// One delegated event listener handles all calculator buttons.
buttons.addEventListener("click", function (event) {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    if (button.dataset.number !== undefined) {
        inputNumber(button.dataset.number);
        return;
    }

    if (button.dataset.operator) {
        chooseOperator(button.dataset.operator);
        return;
    }

    switch (button.dataset.action) {
        case "clear":
            clearAll();
            break;
        case "backspace":
            backspace();
            break;
        case "decimal":
            inputDecimal();
            break;
        case "sign":
            toggleSign();
            break;
        case "equals":
            performEquals();
            break;
    }
});

// Optional keyboard support.
document.addEventListener("keydown", function (event) {
    if (/^[0-9]$/.test(event.key)) {
        inputNumber(event.key);
    } else if (event.key === ".") {
        inputDecimal();
    } else if (["+", "-", "*", "/"].includes(event.key)) {
        chooseOperator(event.key);
    } else if (event.key === "Enter" || event.key === "=") {
        event.preventDefault();
        performEquals();
    } else if (event.key === "Backspace") {
        backspace();
    } else if (event.key === "Escape") {
        clearAll();
    }
});

updateDisplay();
