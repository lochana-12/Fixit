fixit-project-fixed.zip
Zip Archive
i need to push this file into github 
help me doing this

That's expected. You already have an origin configured — it's pointing to the wrong repository (hiteshvishnuvajhala/Fixit).

You don't need to add another origin; just change the existing one.

1. Run this:
git remote set-url origin https://github.com/lochana-12/Fixit.git
2. Verify it:
git remote -v

You should see:

origin  https://github.com/lochana-12/Fixit.git (fetch)
origin  https://github.com/lochana-12/Fixit.git (push)
3. Then push:
git push -u origin main

If everything is correct, you should see something like:

Enumerating objects: ...
Counting objects: ...
Writing objects: 100% ...
To https://github.com/lochana-12/Fixit.git
 * [new branch]      main -> main

Run the git remote set-url command first, then paste the output of git remote -v here if you want me to verify it before you push.

after verifying the folder i send u 
please send me readme.md file in detail professionally

I verified the ZIP you sent and built the README from the actual project structure and code, rather than using a generic template.

It covers:

Project overview and purpose
Features
Technology stack
Architecture
Complete folder structure
Authentication flow
JWT and password security
Task management
Recurring maintenance logic
Upcoming reminders
Full API endpoint documentation
Request examples
Environment variables
MongoDB setup
Frontend/backend setup
Local development instructions
Troubleshooting
Security recommendations
Current limitations
Future enhancements
Git/GitHub instructions
License information

I also specifically documented features that are not fully implemented yet, such as password reset and automated email reminders, rather than falsely presenting them as complete.

Download the README

Download README.md

Put it at the root of your GitHub project, alongside frontend and backend:

Fixit/
├── frontend/
├── backend/
└── README.md

One important thing I noticed during verification: the ZIP itself contains backend/.env with credentials. Your Git staging output earlier showed it was correctly excluded, so do not force-add it.

After adding this README, a good final step would be to run git status once more before pushing, just to make sure no secrets or unnecessary files are staged. 

README.md
Document
can i paste the content present in the file

Yes, absolutely. 👍

You can copy and paste the entire content of the README.md file directly into GitHub.

If you're adding it through GitHub
Open your Fixit repository on GitHub.
Click Add file → Create new file.
Name the file:
README.md
Open the README.md I provided.
Copy all the content.
Paste it into GitHub's editor.
Scroll down and click Commit changes.

GitHub will automatically render the Markdown professionally on your repository's main page.

Or, even easier

Since you already have the project folder on your computer, put the downloaded README.md here:

fixit-project-main/
├── README.md        ← put it here
├── frontend/
└── backend/

Then in your PowerShell:

git add README.md
git commit -m "Add project documentation"
git push

I recommend the second method, because your README will then be part of your local project and Git will upload it together with the rest of the project.

Library
/
README.md
FixIt – Home Repair Task Manager

FixIt is a full-stack home repair and maintenance task management application designed to help homeowners organize recurring maintenance activities, track task priorities, monitor due dates, and manage household repair responsibilities from a centralized dashboard.

The application uses a lightweight HTML/CSS/JavaScript frontend and a Node.js/Express backend with MongoDB for persistent data storage. Authentication is handled with JSON Web Tokens (JWT), while user passwords are securely hashed using bcrypt.

Table of Contents
Project Overview
Key Features
Technology Stack
Project Architecture
Project Structure
Application Workflow
Authentication and Security
Task Management
Recurring Maintenance
API Documentation
Environment Variables
Installation and Setup
Running the Application
Using the Application
Frontend Configuration
Database
Error Handling
Current Limitations
Recommended Future Enhancements
Security Notes
Troubleshooting
License
Project Overview

Managing household maintenance can become difficult when repairs and recurring maintenance activities are spread across notes, calendars, messages, and memory.

FixIt provides a simple web-based solution where users can:

Create a personal account.
Log in securely.
Record home maintenance tasks.
Associate tasks with rooms and appliances/systems.
Assign maintenance frequencies.
Set task priorities.
Add notes and additional details.
Track pending, completed, and overdue tasks.
Filter tasks by room, status, and priority.
Edit or delete existing tasks.
Automatically calculate recurring due dates.
View upcoming maintenance reminders.

Each user's tasks are associated with their authenticated account, preventing users from modifying tasks belonging to another account.

Key Features
User Authentication

FixIt provides account registration and login functionality.

Users can register with:

Full name
Email address
Password
Home type
Email notification preference
Terms and Privacy Policy agreement

Passwords are hashed using bcryptjs before being stored in MongoDB.

After successful registration or login, the backend generates a JWT that the frontend stores in browser localStorage.

Personal Dashboard

After authentication, users are redirected to the main dashboard.

The dashboard provides:

Personalized welcome message
Task creation form
Task list
Task filters
Upcoming reminders
Task completion controls
Task editing
Task deletion
Logout functionality
Task Organization

Every maintenance task can contain:

Task name
Room
Appliance or system
Maintenance frequency
Priority
Notes
Status
Last completed date
Next due date
Task Filtering

Tasks can be filtered by:

Room
Status
Priority

Supported task statuses:

Pending
Overdue
Completed
Recurring Maintenance

FixIt supports the following maintenance frequencies:

Weekly
Monthly
Quarterly
Semi-annually
Annually

When a recurring task is completed, the backend calculates a new due date based on its maintenance frequency.

Upcoming Reminders

The dashboard identifies pending or overdue tasks with due dates within the next 30 days and displays them in the reminders section.

Technology Stack
Frontend
HTML5
CSS3
Vanilla JavaScript
Browser Fetch API
Browser Local Storage
Backend
Node.js
Express.js
Express Async Handler
CORS
dotenv
JSON Web Token (jsonwebtoken)
bcryptjs
Database
MongoDB
Mongoose ODM
Authentication
JWT-based authentication
Bearer token authorization
bcrypt password hashing
Project Architecture

The project follows a simple client-server architecture:

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
Project Structure
fixit-project-main/
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── script.js
│   └── style.css
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   │
│   ├── utils/
│   │   └── emailService.js
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
└── README.md

The real backend/.env file should remain local and must not be committed to GitHub.

Application Workflow
1. User Registration

The user opens signup.html and provides the required account information.

The frontend sends the registration request to:

POST /api/auth/register

The backend:

Validates the required fields.
Checks whether the email already exists.
Creates the user.
Hashes the password through the Mongoose pre-save hook.
Generates a JWT.
Returns the authenticated user's information.
2. User Login

The user enters their email and password on login.html.

The frontend sends:

POST /api/auth/login

The backend:

Finds the user by email.
Compares the supplied password with the stored bcrypt hash.
Generates a JWT if authentication succeeds.
Returns the token and user information.
3. Authenticated Dashboard

The frontend stores the JWT in localStorage.

For protected requests, the token is sent using:

Authorization: Bearer <JWT>

The backend middleware verifies the token and loads the corresponding user.

4. Task Operations

Authenticated users can then:

Create tasks.
Retrieve tasks.
Filter tasks.
Update tasks.
Complete tasks.
Delete tasks.
Authentication and Security

FixIt uses JWT-based authentication.

The authentication flow is:

Login / Registration
        │
        ▼
Backend validates credentials
        │
        ▼
JWT generated
        │
        ▼
Frontend stores JWT
        │
        ▼
JWT sent with protected API requests
        │
        ▼
Backend verifies JWT
        │
        ▼
Authenticated user identified
Password Security

Passwords are not stored as plain text.

The User model uses bcryptjs to:

Generate a password salt.
Hash passwords before saving.
Compare login passwords against the stored hash.
User Authorization

Task records contain a reference to the owning user.

Before updating or deleting a task, the backend verifies that:

task.user === authenticatedUser._id

This prevents one authenticated user from modifying another user's tasks through the API.

Task Management

The task model supports the following fields:

Field	Description
taskName	Name of the maintenance task
room	Room/location associated with the task
appliance	Appliance or home system
frequency	Recurrence interval
priority	Task urgency
notes	Optional additional information
status	Pending, completed, or overdue
lastCompleted	Most recent completion date
nextDueDate	Calculated next maintenance date
user	User who owns the task
Supported Rooms
Living Room
Kitchen
Bedroom
Bathroom
Garage
Basement
Attic
Outdoor
Supported Appliances and Systems
Air Conditioning
Plumbing
Electrical
Heating
Refrigerator
Dishwasher
Washer
Dryer
Water Heater
Furnace
General Maintenance
Supported Priorities
Low
Medium
High
Urgent
Recurring Maintenance

When a task is created, FixIt calculates an initial nextDueDate.

When a task is marked as completed, the backend records the current date as lastCompleted and calculates the next due date based on the selected frequency.

Example:

Task: Clean Air Conditioner
Frequency: Quarterly
Completed: January 15
Next Due: April 15

Supported recurrence intervals:

Frequency	Interval
Weekly	+7 days
Monthly	+1 month
Quarterly	+3 months
Semi-annually	+6 months
Annually	+1 year

Overdue tasks are identified when their due date has passed while the task remains pending.

API Documentation

The backend API is available under:

http://localhost:5000/api
Authentication Endpoints
Register User
POST /api/auth/register

Example request:

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "homeType": "house",
  "agreeTerms": true,
  "emailNotifications": false
}

Example response:

{
  "_id": "USER_ID",
  "fullName": "John Doe",
  "email": "john@example.com",
  "homeType": "house",
  "emailNotifications": false,
  "token": "JWT_TOKEN"
}
Login
POST /api/auth/login

Example request:

{
  "email": "john@example.com",
  "password": "securepassword"
}
Get Current User
GET /api/auth/me

Authentication:

Authorization: Bearer <JWT_TOKEN>
Task Endpoints

All task endpoints require authentication.

Get Tasks
GET /api/tasks

Optional filters:

GET /api/tasks?room=kitchen
GET /api/tasks?status=pending
GET /api/tasks?status=overdue
GET /api/tasks?priority=high

Filters can also be combined:

GET /api/tasks?room=kitchen&status=pending&priority=high
Create Task
POST /api/tasks

Example:

{
  "taskName": "Clean air conditioner filter",
  "room": "bedroom",
  "appliance": "ac",
  "frequency": "monthly",
  "priority": "medium",
  "notes": "Check filter condition before cleaning."
}
Update Task
PUT /api/tasks/:id

Example for completing a task:

{
  "status": "completed"
}

When completed, the backend automatically updates:

status
lastCompleted
nextDueDate
Delete Task
DELETE /api/tasks/:id

Example:

DELETE /api/tasks/64xxxxxxxxxxxxxxxxxxxx
Environment Variables

The backend requires environment variables for MongoDB, JWT authentication, and the server port.

Create a file named:

backend/.env

Use the following structure:

MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/fixitdb?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_string
PORT=5000
Variable Reference
Variable	Purpose	Example
MONGO_URI	MongoDB connection string	MongoDB Atlas URI
JWT_SECRET	Secret used to sign JWTs	Long random secret
PORT	Backend server port	5000

A template is included in:

backend/.env.example
Installation and Setup
Prerequisites

Install the following before running FixIt:

Node.js
npm
MongoDB database or MongoDB Atlas account
Git

You can verify Node.js and npm with:

node --version
npm --version
1. Clone the Repository
git clone https://github.com/YOUR_USERNAME/Fixit.git

Move into the project directory:

cd Fixit
2. Configure the Backend

Move into the backend directory:

cd backend

Install dependencies:

npm install

Create:

backend/.env

Add your MongoDB URI, JWT secret, and port.

3. Start the Backend

From the backend directory:

node server.js

A successful startup should display messages similar to:

MongoDB Connected: ...
Server running on port 5000

The API can then be tested at:

http://localhost:5000/

The root endpoint should return:

FixIt Backend API is running!
Running the Frontend

The frontend consists of static HTML, CSS, and JavaScript files.

Open:

frontend/login.html

using a local web server.

For development, a VS Code extension such as Live Server can be used.

The frontend expects the backend API at:

http://localhost:5000/api

This configuration is defined in:

frontend/script.js
const API_BASE_URL = 'http://localhost:5000/api';
Recommended Local Development Setup

A typical development session can use two terminals.

Terminal 1 – Backend
cd backend
npm install
node server.js
Terminal 2 – Frontend

Serve the frontend directory using a local static web server.

For example, with VS Code Live Server:

Open frontend/login.html
→ Right-click
→ Open with Live Server

Then use the browser to register and log in.

Using the Application
Create an Account
Open the signup page.
Enter your name.
Enter your email.
Create a password.
Confirm the password.
Select your home type.
Accept the Terms of Service and Privacy Policy.
Optionally enable email notifications.
Click Create Account.
Log In
Open the login page.
Enter your email.
Enter your password.
Click Sign In.
Create a Maintenance Task

From the dashboard:

Enter a task name.
Select a room.
Select an appliance/system.
Select a maintenance frequency.
Select a priority.
Optionally add notes.
Click Add Task.
Complete a Task

Click the task's completion action.

The backend will:

Mark the task as completed.
Record the current date.
Calculate the next maintenance date.
Edit a Task

Select a task's edit option.

The existing task information is loaded into the task form. Update the fields and save the changes.

Delete a Task

Select the delete option and confirm the action.

Filter Tasks

Use the dashboard filters to narrow tasks by:

Room
Status
Priority
Database

FixIt uses MongoDB through Mongoose.

User Collection

The user model stores:

Full name
Email
Hashed password
Home type
Email notification preference
Creation timestamp
Update timestamp
Task Collection

The task model stores:

Owner reference
Task name
Room
Appliance/system
Frequency
Priority
Notes
Status
Last completion date
Next due date
Creation timestamp
Update timestamp

Tasks are linked to users using a MongoDB ObjectId reference.

Error Handling

The backend uses express-async-handler to simplify asynchronous error handling in controllers.

Common HTTP responses include:

Status	Meaning
200	Request successful
201	Resource created successfully
400	Invalid request or missing data
401	Authentication required or credentials invalid
403	User is not authorized to access the resource
404	Resource not found

The frontend displays user-friendly notifications when API requests fail.

Current Limitations

The current implementation is intentionally lightweight and suitable for a development or academic/project environment.

Known limitations include:

The frontend API URL is configured for local development using localhost.
The frontend stores the JWT in browser localStorage.
The Forgot Password option currently displays a "coming soon" message rather than implementing password reset.
Email notification preference is stored with the user, but a complete automated email reminder workflow is not currently implemented.
The backend does not currently include a production process manager or deployment configuration.
CORS is currently configured to allow all origins for development.
There is no automated backend test suite configured in package.json.
There is no production frontend build pipeline because the frontend uses plain HTML, CSS, and JavaScript.
Recommended Future Enhancements

The project can be extended with the following features.

Authentication
Password reset via email.
Email verification.
Refresh tokens.
Secure HTTP-only cookies.
Rate limiting for authentication endpoints.
Account deletion.
Password change functionality.
Task Management
Task categories.
Custom recurrence intervals.
Attachments and repair photos.
Cost tracking.
Vendor/service-provider information.
Task history and completion history.
Bulk task operations.
Search functionality.
Notifications
Automated email reminders.
Configurable reminder schedules.
Browser notifications.
Daily and weekly maintenance summaries.
Dashboard
Maintenance statistics.
Completion rate.
Overdue task count.
Priority summaries.
Monthly maintenance calendar.
Charts and visual analytics.
Deployment
Production API deployment.
Production MongoDB configuration.
HTTPS.
Environment-specific configuration.
CI/CD pipeline.
Automated testing.
Production CORS configuration.
Security Notes
Never Commit Secrets

The following file must never be committed:

backend/.env

The repository includes .gitignore rules that exclude environment files.

Use:

backend/.env.example

as the safe configuration template.

If a Secret Was Accidentally Committed

Simply deleting .env from the working directory is not enough if it has already been pushed to Git history.

Immediately rotate:

MongoDB credentials.
JWT secret.
Any other exposed credentials.

Then remove the secret from the Git history using an appropriate history-rewriting procedure.

Production Security Recommendations

Before deploying FixIt publicly:

Use HTTPS.
Restrict CORS to trusted frontend domains.
Use a strong randomly generated JWT secret.
Store secrets using the hosting provider's environment-variable system.
Avoid storing long-lived authentication tokens in localStorage where possible.
Add authentication rate limiting.
Validate and sanitize user input.
Add security headers.
Keep npm dependencies updated.
Use a production MongoDB user with appropriate permissions.
Troubleshooting
Backend Does Not Start

Check that:

backend/.env

exists and contains a valid:

MONGO_URI=...
JWT_SECRET=...
PORT=5000

Then reinstall dependencies:

cd backend
npm install

Start the server:

node server.js
MongoDB Connection Error

Verify:

MongoDB Atlas is running.
The connection string is correct.
The database user and password are correct.
Your IP address is allowed by the MongoDB network access settings.
Special characters in the MongoDB password are properly URL-encoded when required.
Frontend Cannot Connect to Backend

Verify that the backend is running on:

http://localhost:5000

Then verify the API configuration in:

frontend/script.js

The expected configuration is:

const API_BASE_URL = 'http://localhost:5000/api';
Authentication Fails

Check:

The backend is running.
MongoDB is connected.
The account exists.
The email and password are correct.
JWT_SECRET is configured.
The browser's stored JWT has not expired.

If necessary, log out and log in again to obtain a fresh token.

Git and GitHub

The project is designed to be version-controlled using Git.

Typical commands:

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/Fixit.git
git push -u origin main

For future changes:

git add .
git commit -m "Describe your changes"
git push

Before committing, always check:

git status

Make sure sensitive files such as .env are not staged.

License

This project currently does not declare a specific open-source license in package.json.

If this project is intended for public distribution, choose an appropriate license such as:

MIT License
Apache License 2.0
GNU GPL v3

Do not add a license unless you have decided which licensing terms should apply to the project.

Project Status

Current status: Functional full-stack development project

Frontend: HTML, CSS, Vanilla JavaScript

Backend: Node.js + Express

Database: MongoDB + Mongoose

Authentication: JWT + bcrypt

Primary purpose: Home repair and recurring maintenance task management

Author

FixIt is a home maintenance management application developed as a full-stack web project.

For contributions, improvements, or deployment, open an issue or submit a pull request through the project's GitHub repository.
