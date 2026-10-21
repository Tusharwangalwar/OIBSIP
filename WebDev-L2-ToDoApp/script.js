
"use strict";

const STORAGE_KEY = "taskflow-tasks-v1";

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const formMessage = document.getElementById("form-message");

const pendingList = document.getElementById("pending-list");
const completedList = document.getElementById("completed-list");

const pendingEmpty = document.getElementById("pending-empty");
const completedEmpty = document.getElementById("completed-empty");

const pendingCount = document.getElementById("pending-count");
const completedCount = document.getElementById("completed-count");
const totalCount = document.getElementById("total-count");

const pendingPill = document.getElementById("pending-pill");
const completedPill = document.getElementById("completed-pill");
const clearCompletedButton = document.getElementById("clear-completed");
const progressText = document.getElementById("progress-text");

let tasks = loadTasks();
let editingTaskId = null;
let messageTimer = null;

// Create unique task IDs.
function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// Read saved tasks from localStorage.
function loadTasks() {
    try {
        const savedTasks = localStorage.getItem(STORAGE_KEY);

        if (!savedTasks) {
            return [];
        }

        const parsedTasks = JSON.parse(savedTasks);

        if (!Array.isArray(parsedTasks)) {
            return [];
        }

        return parsedTasks.filter((task) =>
            task &&
            typeof task.id === "string" &&
            typeof task.text === "string" &&
            typeof task.completed === "boolean"
        );
    } catch (error) {
        console.error("Could not load saved tasks:", error);
        return [];
    }
}

// Save tasks whenever something changes.
function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        return true;
    } catch (error) {
        console.error("Could not save tasks:", error);
        showMessage("Unable to save tasks in this browser.");
        return false;
    }
}

// Display a short message below the input.
function showMessage(message) {
    formMessage.textContent = message;

    if (messageTimer !== null) {
        clearTimeout(messageTimer);
    }

    messageTimer = setTimeout(() => {
        formMessage.textContent = "";
        messageTimer = null;
    }, 3500);
}

// Add a new task.
taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (!text) {
        showMessage("Please enter a task before adding it.");
        taskInput.focus();
        return;
    }

    if (text.length > 200) {
        showMessage("A task must be 200 characters or fewer.");
        return;
    }

    tasks.unshift({
        id: createId(),
        text,
        completed: false,
        createdAt: new Date().toISOString()
    });

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
    formMessage.textContent = "";
});

// Build task elements without inserting user text as HTML.
function createTaskElement(task) {
    const item = document.createElement("li");
    item.className = "task-item";
    item.dataset.id = task.id;

    const checkbox = document.createElement("button");
    checkbox.type = "button";
    checkbox.className = "task-checkbox";
    checkbox.classList.toggle("is-checked", task.completed);
    checkbox.textContent = task.completed ? "✓" : "";
    checkbox.setAttribute(
        "aria-label",
        task.completed ? "Mark task as pending" : "Mark task as completed"
    );
    checkbox.setAttribute("aria-pressed", String(task.completed));
    checkbox.dataset.action = "toggle";

    const title = document.createElement("span");
    title.className = "task-title";
    title.classList.toggle("is-completed", task.completed);
    title.textContent = task.text;

    item.append(checkbox, title);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    if (!task.completed) {
        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "icon-button";
        editButton.textContent = "✎";
        editButton.setAttribute("aria-label", `Edit task: ${task.text}`);
        editButton.title = "Edit task";
        editButton.dataset.action = "edit";
        actions.appendChild(editButton);
    }

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "icon-button delete-button";
    deleteButton.textContent = "×";
    deleteButton.setAttribute("aria-label", `Delete task: ${task.text}`);
    deleteButton.title = "Delete task";
    deleteButton.dataset.action = "delete";

    actions.appendChild(deleteButton);
    item.appendChild(actions);

    return item;
}

// Render pending and completed lists and update counts.
function renderTasks() {
    pendingList.replaceChildren();
    completedList.replaceChildren();

    const pendingTasks = tasks.filter((task) => !task.completed);
    const completedTasks = tasks.filter((task) => task.completed);

    pendingTasks.forEach((task) => {
        if (task.id === editingTaskId) {
            pendingList.appendChild(createEditElement(task));
        } else {
            pendingList.appendChild(createTaskElement(task));
        }
    });

    completedTasks.forEach((task) => {
        completedList.appendChild(createTaskElement(task));
    });

    pendingCount.textContent = pendingTasks.length;
    completedCount.textContent = completedTasks.length;
    totalCount.textContent = tasks.length;

    pendingPill.textContent = pendingTasks.length;
    completedPill.textContent = completedTasks.length;

    pendingEmpty.hidden = pendingTasks.length > 0;
    completedEmpty.hidden = completedTasks.length > 0;

    clearCompletedButton.disabled = completedTasks.length === 0;

    if (tasks.length === 0) {
        progressText.textContent = "Let's make progress!";
    } else if (pendingTasks.length === 0) {
        progressText.textContent = "Everything completed. Great work!";
    } else {
        progressText.textContent =
            `${completedTasks.length} of ${tasks.length} tasks completed`;
    }
}

// Create an inline editing form for a pending task.
function createEditElement(task) {
    const item = document.createElement("li");
    item.className = "task-item";
    item.dataset.id = task.id;

    const editForm = document.createElement("form");
    editForm.className = "edit-form";
    editForm.dataset.action = "save-edit";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "edit-input";
    input.value = task.text;
    input.maxLength = 200;
    input.setAttribute("aria-label", "Edit task name");
    input.required = true;

    const saveButton = document.createElement("button");
    saveButton.type = "submit";
    saveButton.className = "save-edit";
    saveButton.textContent = "Save";

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "cancel-edit";
    cancelButton.textContent = "Cancel";
    cancelButton.dataset.action = "cancel-edit";

    editForm.append(input, saveButton, cancelButton);
    item.appendChild(editForm);

    return item;
}

// Handle task actions through event delegation.
function handleListClick(event) {
    const button = event.target.closest("button[data-action]");

    if (!button) {
        return;
    }

    const item = button.closest(".task-item");

    if (!item) {
        return;
    }

    const task = tasks.find((entry) => entry.id === item.dataset.id);

    if (!task) {
        return;
    }

    const action = button.dataset.action;

    if (action === "toggle") {
        task.completed = !task.completed;

        if (editingTaskId === task.id) {
            editingTaskId = null;
        }

        saveTasks();
        renderTasks();
    } else if (action === "edit") {
        editingTaskId = task.id;
        renderTasks();

        const editInput = pendingList.querySelector(".edit-input");

        if (editInput) {
            editInput.focus();
            editInput.select();
        }
    } else if (action === "delete") {
        tasks = tasks.filter((entry) => entry.id !== task.id);

        if (editingTaskId === task.id) {
            editingTaskId = null;
        }

        saveTasks();
        renderTasks();
    } else if (action === "cancel-edit") {
        editingTaskId = null;
        renderTasks();
    }
}

pendingList.addEventListener("click", handleListClick);
completedList.addEventListener("click", handleListClick);

// Save changes from the inline editing form.
pendingList.addEventListener("submit", (event) => {
    const editForm = event.target.closest('form[data-action="save-edit"]');

    if (!editForm) {
        return;
    }

    event.preventDefault();

    const item = editForm.closest(".task-item");
    const input = editForm.querySelector(".edit-input");
    const newText = input.value.trim();

    if (!newText) {
        input.setCustomValidity("Please enter a task name.");
        input.reportValidity();
        input.setCustomValidity("");
        input.focus();
        return;
    }

    if (newText.length > 200) {
        showMessage("A task must be 200 characters or fewer.");
        return;
    }

    const task = tasks.find((entry) => entry.id === item.dataset.id);

    if (task) {
        task.text = newText;
        saveTasks();
    }

    editingTaskId = null;
    renderTasks();
});

// Clear every completed task.
clearCompletedButton.addEventListener("click", () => {
    const completedTasks = tasks.filter((task) => task.completed);

    if (completedTasks.length === 0) {
        return;
    }

    const shouldClear = window.confirm(
        `Delete ${completedTasks.length} completed task(s)?`
    );

    if (!shouldClear) {
        return;
    }

    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    renderTasks();
});

// Show today's date.
function showTodayDate() {
    const dateElement = document.getElementById("today-date");

    dateElement.textContent = new Intl.DateTimeFormat("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
    }).format(new Date());
}

// Initialize the app.
showTodayDate();
renderTasks();
