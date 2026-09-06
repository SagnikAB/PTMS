# Public Transport Management System (PTMS)

A modern, full-stack web application designed to streamline public transit operations. The system enables passengers to search route schedules, administrative staff to manage routes and vehicle deployments, and system operators to oversee user access via Role-Based Access Control (RBAC).

---

## 🚀 Features (Sprint 1 Release)

* **User Authentication & Authorization:** Secure JWT-based authentication supporting three distinct user roles: `Admin`, `Driver`, and `Passenger`.
* **Route & Fleet Management:** Admin functionality to create, update, and manage transport routes, intermediate stops, and vehicle schedules.
* **Passenger Route Search:** Public-facing search engine allowing passengers to query available transport options by source and destination.
* **Modern UI/UX:** Fully responsive user interface built using React and styled with Tailwind CSS.

---

## 🛠️ Tech Stack

### Backend
* **Language/Framework:** Python 3.11+, FastAPI
* **Database:** MongoDB (using Motor for async operations & Pydantic v2 for data validation)
* **Security:** Passlib (bcrypt password hashing), PyJWT (Bearer token validation)

### Frontend
* **Library/Framework:** React 18+ (Vite / CRA)
* **Styling:** Tailwind CSS
* **State & API Handling:** React Hooks, Fetch / Axios

---

## 📁 Project Structure

```text
ptms-project/
├── backend/
│   ├── app/
│   │   ├── database.py       # Async Motor MongoDB connection setup
│   │   ├── security.py       # JWT creation, hashing, & RBAC dependencies
│   │   ├── schemas.py        # Pydantic v2 data models & validation
│   │   └── routers/
│   │       ├── auth.py       # Register & login endpoints
│   │       ├── admin.py      # Route & vehicle management endpoints
│   │       └── search.py     # Public route lookup endpoints
│   ├── seed_data.json        # Database initialization dataset
│   ├── requirements.txt      # Python dependencies
│   └── main.py               # FastAPI entry point
│
└── frontend/
    ├── src/
    │   ├── api/              # API service client & authorization headers
    │   ├── components/       # Auth forms, Search tables, Admin management UI
    │   ├── App.jsx           # Main React root component
    │   └── main.jsx          # DOM rendering
    ├── package.json
    └── tailwind.config.js
