
"use strict";

const USERS_KEY = "accesspoint-demo-users";
const SESSION_KEY = "accesspoint-demo-session";

const loginView = document.getElementById("login-view");
const registerView = document.getElementById("register-view");
const loginTab = document.getElementById("login-tab");
const registerTab = document.getElementById("register-tab");

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

const loginMessage = document.getElementById("login-message");
const registerMessage = document.getElementById("register-message");

function showView(view) {
    const isLogin = view === "login";

    loginView.hidden = !isLogin;
    registerView.hidden = isLogin;

    loginTab.classList.toggle("active", isLogin);
    registerTab.classList.toggle("active", !isLogin);

    loginTab.setAttribute("aria-selected", String(isLogin));
    registerTab.setAttribute("aria-selected", String(!isLogin));

    clearMessages();
}

function clearMessages() {
    loginMessage.textContent = "";
    registerMessage.textContent = "";
    loginMessage.classList.remove("success");
    registerMessage.classList.remove("success");
}

loginTab.addEventListener("click", () => showView("login"));
registerTab.addEventListener("click", () => showView("register"));

document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.view));
});

function readUsers() {
    try {
        const data = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function normalizeEmail(email) {
    return email.trim().toLowerCase();
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// SHA-256 is used only as a basic learning demonstration.
// Production authentication needs server-side password hashing
// with a password-specific algorithm such as Argon2id or bcrypt.
async function hashPassword(password) {
    if (!window.crypto?.subtle) {
        throw new Error(
            "Password hashing is unavailable. Open this project through localhost or HTTPS."
        );
    }

    const bytes = new TextEncoder().encode(password);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", bytes);

    return Array.from(new Uint8Array(hashBuffer))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}

function setMessage(element, message, isSuccess = false) {
    element.textContent = message;
    element.classList.toggle("success", isSuccess);
}

// Registration
registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage(registerMessage, "");

    const username = document.getElementById("register-username").value.trim();
    const email = normalizeEmail(
        document.getElementById("register-email").value
    );
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (username.length < 3 || username.length > 30) {
        setMessage(registerMessage, "Username must be 3–30 characters long.");
        return;
    }

    if (!isValidEmail(email)) {
        setMessage(registerMessage, "Please enter a valid email address.");
        return;
    }

    if (password.length < 8) {
        setMessage(registerMessage, "Password must contain at least 8 characters.");
        return;
    }

    if (password.length > 128) {
        setMessage(registerMessage, "Password must not exceed 128 characters.");
        return;
    }

    if (password !== confirmPassword) {
        setMessage(registerMessage, "The passwords do not match.");
        return;
    }

    const users = readUsers();

    if (users.some((user) => user.email === email)) {
        setMessage(registerMessage, "An account with this email already exists.");
        return;
    }

    try {
        const passwordHash = await hashPassword(password);

        users.push({
            id: window.crypto.randomUUID(),
            username,
            email,
            passwordHash
        });

        saveUsers(users);

        registerForm.reset();
        document.getElementById("login-email").value = email;
        showView("login");
        setMessage(loginMessage, "Account created! You can now sign in.", true);
    } catch (error) {
        setMessage(
            registerMessage,
            error.message || "Unable to create the demo account."
        );
    }
});

// Login
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage(loginMessage, "");

    const email = normalizeEmail(
        document.getElementById("login-email").value
    );
    const password = document.getElementById("login-password").value;

    if (!isValidEmail(email) || !password) {
        setMessage(loginMessage, "Enter a valid email and password.");
        return;
    }

    try {
        const passwordHash = await hashPassword(password);
        const user = readUsers().find((entry) =>
            entry.email === email && entry.passwordHash === passwordHash
        );

        if (!user) {
            setMessage(loginMessage, "Incorrect email or password.");
            return;
        }

        // This session marker is for demonstration only and is not secure.
        sessionStorage.setItem(SESSION_KEY, user.id);

        window.location.assign("dashboard.html");
    } catch (error) {
        setMessage(
            loginMessage,
            error.message || "Unable to sign in. Please try again."
        );
    }
});

// Redirect an already logged-in demo session to the dashboard.
if (sessionStorage.getItem(SESSION_KEY)) {
    window.location.replace("dashboard.html");
}
