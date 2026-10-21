
# AccessPoint — Login Authentication System

## Project Overview

AccessPoint is a beginner-friendly authentication interface developed as an OASIS INFOBYTE Level 2 project. It demonstrates registration, login form validation, a dashboard, and logout using HTML, CSS, and vanilla JavaScript.

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- Browser localStorage and sessionStorage
- Web Crypto API (SHA-256 demonstration)

## Features

- Registration using username and email
- Minimum password length of 8 characters
- Confirm-password validation
- Duplicate email checking
- Login with registered demo credentials
- Error messages for invalid credentials
- Demo dashboard with account information
- Redirect to login when no valid demo session is found
- Logout functionality
- Responsive dark-themed interface

## Project Structure

```text
WebDev-L2-LoginAuth/
├── index.html
├── style.css
├── script.js
├── dashboard.html
├── dashboard.js
├── README.md
└── screenshots/
```

## How to Run

1. Open the project folder in Visual Studio Code.
2. Start the Live Server extension from `index.html`.
3. Register a demo account using a test email and a password of at least 8 characters.
4. Sign in with those credentials.
5. Test the dashboard and logout.
6. Refresh the dashboard after logging out to check the redirect.

Use localhost or HTTPS so the Web Crypto API is available.

## Testing Checklist

- Registration succeeds with valid input.
- Passwords shorter than 8 characters are rejected.
- Mismatched passwords are rejected.
- Duplicate email addresses are rejected.
- Correct credentials open the dashboard.
- Incorrect credentials display an error.
- The dashboard redirects when the demo session is missing.
- Logout returns the user to the login page.

## Security Limitations

This is a client-side learning demonstration, not production authentication.

- Browser storage can be inspected and modified by the user.
- Client-side session checks can be bypassed.
- SHA-256 alone is not an appropriate password-storage scheme for production.
- There is no server-side identity verification, authorization, rate limiting, or secure account database.
- Never enter real passwords or sensitive personal information.

A production application should use a backend, HTTPS, secure server-side sessions, and a password-hashing algorithm designed for passwords, such as Argon2id or bcrypt.

## Screenshots

Save screenshots of registration, login validation, the dashboard, and mobile layout in the `screenshots/` directory.

## Learning Outcomes

- HTML forms and input validation
- JavaScript event handling
- Managing browser storage
- Hashing demonstration using Web Crypto
- Creating a dashboard and logout flow
- Responsive CSS and basic authentication concepts

## Internship

OASIS INFOBYTE — Web Development & Designing  
Level 2 — Task 4: Login Authentication System
