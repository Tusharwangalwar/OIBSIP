# System Architecture & Design Blueprint

## 👥 1. System Actors
*   **User (Student/Borrower):** Can browse books, search categories, borrow/return items, and track fines.
*   **Admin (Librarian):** Has full access to manage inventory (CRUD books/categories), track active borrowings, and manage user records.

---

## 📋 2. Core Use Cases & API Mapping

| Actor | Action / Use Case | HTTP Method | API Endpoint | Target DB Table |
| :--- | :--- | :--- | :--- | :--- |
| **All** | Authenticate / Login | `POST` | `/api/auth/login` | `users` / `admins` |
| **All** | Register Account | `POST` | `/api/auth/register` | `users` |
| **User** | View All Books | `GET` | `/api/books` | `books` |
| **User** | Request Book Issue | `POST` | `/api/issues/borrow` | `issued_books` |
| **Admin** | Add New Book | `POST` | `/api/admin/books` | `books` |
| **Admin** | Update Book Details | `PUT` | `/api/admin/books/{id}`| `books` |
| **Admin** | Delete a Book | `DELETE`| `/api/admin/books/{id}`| `books` |
| **Admin** | Track Overdue Fines | `GET` | `/api/admin/fines` | `fines` |

---

## 🏗️ 3. Layered Communication Flow
Every transaction in this application travels down a strict multi-tiered hierarchy to protect data integrity:

[React Frontend UI] 
       │  (HTTP Request / JSON)
       ▼
[Controller Layer] (Validates Endpoint Route & Request Payload Structure)
       │
       ▼
[Service Layer] (Enforces Business Logic, Constraints & Library Rules)
       │
       ▼
[Repository Layer] (Interacts with Database Engine via Spring Data JPA)
       │
       ▼
[MySQL Database] (Persistent Storage)