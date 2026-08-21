# FixIt – Home Repair Task Manager

FixIt is a full-stack home repair and maintenance task management application designed to help homeowners organize recurring maintenance activities, track task priorities, monitor due dates, and manage household repair responsibilities from a centralized dashboard.

The application uses a lightweight HTML/CSS/JavaScript frontend and a Node.js/Express backend with MongoDB for persistent data storage. Authentication is handled with JSON Web Tokens (JWT), while user passwords are securely hashed using bcrypt.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Project Structure](#project-structure)
- [Application Workflow](#application-workflow)
- [Authentication and Security](#authentication-and-security)
- [Task Management](#task-management)
- [Recurring Maintenance](#recurring-maintenance)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Installation and Setup](#installation-and-setup)
- [Running the Application](#running-the-application)
- [Using the Application](#using-the-application)
- [Database](#database)
- [Error Handling](#error-handling)
- [Current Limitations](#current-limitations)
- [Future Enhancements](#future-enhancements)
- [Security Notes](#security-notes)
- [Troubleshooting](#troubleshooting)
- [Git and GitHub](#git-and-github)
- [License](#license)

---

## Project Overview

Managing household maintenance can become difficult when repairs and recurring maintenance activities are spread across notes, calendars, messages, and memory.

FixIt provides a simple web-based solution where users can:

- Create a personal account
- Log in securely
- Create home maintenance tasks
- Associate tasks with rooms and appliances
- Set maintenance frequencies
- Assign task priorities
- Add notes and additional details
- Track pending, completed, and overdue tasks
- Filter tasks by room, status, and priority
- Edit existing tasks
- Delete tasks
- Automatically calculate recurring due dates
- View upcoming maintenance reminders

Each user's tasks are associated with their authenticated account, helping prevent users from accessing or modifying tasks belonging to another account.

---

## Key Features

### User Authentication

FixIt provides secure registration and login functionality.

Users can register with:

- Full name
- Email address
- Password
- Home type
- Email notification preference
- Terms and Privacy Policy agreement

Passwords are hashed using `bcryptjs` before being stored in MongoDB.

After successful registration or login, the backend generates a JSON Web Token (JWT), which is used to authenticate protected API requests.

### Personal Dashboard

After authentication, users can access the main dashboard.

The dashboard provides:

- Personalized welcome message
- Task creation form
- Task list
- Task filters
- Upcoming reminders
- Task completion controls
- Task editing
- Task deletion
- Logout functionality

### Task Organization

Each maintenance task can contain:

- Task name
- Room
- Appliance or system
- Maintenance frequency
- Priority
- Notes
- Status
- Last completed date
- Next due date

### Task Filtering

Tasks can be filtered by:

- Room
- Status
- Priority

Supported task statuses include:

- Pending
- Completed
- Overdue

### Recurring Maintenance

FixIt supports recurring maintenance frequencies such as:

- Weekly
- Monthly
- Quarterly
- Semi-annually
- Annually

When a recurring task is completed, the backend calculates a new due date based on the selected maintenance frequency.

### Upcoming Reminders

The dashboard identifies pending or overdue maintenance tasks with upcoming due dates and displays them in the reminders section.

---

## Technology Stack

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript
- Fetch API
- Browser Local Storage

### Backend

- Node.js
- Express.js
- Express Async Handler
- CORS
- dotenv
- JSON Web Token (`jsonwebtoken`)
- bcryptjs

### Database

- MongoDB
- Mongoose ODM

### Authentication

- JWT-based authentication
- Bearer token authorization
- bcrypt password hashing

---

## Project Architecture

FixIt follows a client-server architecture.

```text
┌──────────────────────────┐
│        Frontend          │
│                          │
│ HTML + CSS + JavaScript  │
└────────────┬─────────────┘
             │
             │ HTTP / JSON
             │
             ▼
┌──────────────────────────┐
│        Express API       │
│                          │
│ Authentication           │
│ Task Management          │
│ JWT Middleware           │
└────────────┬─────────────┘
             │
             │ Mongoose
             ▼
┌──────────────────────────┐
│         MongoDB          │
│                          │
│ Users                    │
│ Tasks                    │
└──────────────────────────┘
