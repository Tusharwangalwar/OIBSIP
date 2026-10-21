
"use strict";

const USERS_KEY = "accesspoint-demo-users";
const SESSION_KEY = "accesspoint-demo-session";

function readUsers() {
    try {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
        return Array.isArray(users) ? users : [];
    } catch {
        return [];
    }
}

function returnToLogin() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.replace("index.html");
}

const sessionId = sessionStorage.getItem(SESSION_KEY);
const user = readUsers().find((entry) => entry.id === sessionId);

if (!sessionId || !user) {
    returnToLogin();
} else {
    document.getElementById("dashboard-username").textContent = user.username;
    document.getElementById("account-username").textContent = user.username;
    document.getElementById("account-email").textContent = user.email;
}

function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.replace("index.html");
}

document.getElementById("logout-button").addEventListener("click", logout);
document.getElementById("dashboard-logout").addEventListener("click", logout);
