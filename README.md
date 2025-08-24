create frontend and backend initial setup 

## Backend Setup - Agent Management System 

## PROJECT STRUCTURE 

backend/
├── config/
│   └── mongodb.js          # Handles MongoDB connection
├── controllers/
│   └── adminController.js  # Admin-related logic (login, add agent)
├── middleware/
│   └── authAdmin.js        # Middleware for admin authentication
├── models/
│   └── agentModel.js       # Mongoose schema/model for agents
├── routes/
│   └── adminRoute.js       # Defines admin API routes
└── server.js               # Entry point of the backend


# Explanation of Files 

1. config/mongodb.js

Contains the database connection logic using Mongoose.

Reads the MONGODB_URI from environment variables.

Prints a confirmation in the console when the database is successfully connected. 

2. server.js

The main entry point of the backend.

Sets up Express server with middlewares:

express.json() for handling JSON data.

cors() to allow API access from different origins (frontend).

Defines a simple root route / → returns "API WORKING".

Mounts all admin routes under /api/admin.

Starts the server on the port from .env or defaults to 4000.


3. models/agentModel.js

Defines the Agent schema with Mongoose.

Fields:

name: Required string.

email: Required + unique.

mobile: Required + unique (with country code).

password: Required, will always be stored as a hashed password.

assignedData: Array of objects to store customer info (firstName, phone, notes). 


4. controllers/adminController.js

This file contains all the logic for admin operations.

loginAdmin

Validates admin credentials (email + password).

Matches against values stored in .env (ADMIN_EMAIL, ADMIN_PASSWORD).

If valid, creates a JWT token with role set as "admin", expires in 24 hours.

If invalid, returns proper error messages with status codes.

addAgent

Validates input (name, email, password, mobile).

Ensures password is minimum 8 characters.

Checks if email or mobile already exists in the database.

Hashes the password using bcrypt (with salt).

Saves the new agent in MongoDB.

Returns success or error messages accordingly.


5. middleware/authAdmin.js

A middleware that protects admin-only routes.

Extracts the JWT token from request header Authorization: Bearer <token>.

Verifies the token using JWT_SECRET.

Confirms that the token belongs to an admin role.

If valid → allows request to continue.

If invalid or expired → blocks request with proper error message. 


6. routes/adminRoute.js

Defines all admin-related routes:

POST /api/admin/login → Admin login (no auth required).

POST /api/admin/add-agent → Create a new agent (requires admin token, protected by authAdmin). 


## Security Features

 JWT authentication with expiration

Password hashing using bcrypt

 Validation for inputs and password strength

 Duplicate email/mobile prevention

Role-based access control (only admins)

 Proper HTTP status codes for responses

Centralized error handling and logging

 Uses standard Authorization: Bearer <token> format

## Key Highlights

Secure Admin Login with JWT token (24h expiry).

Agent Management with hashed passwords.

Middleware Protection for admin-only routes.

Clean Project Structure for easy scaling.

Environment-based Configuration (secure & flexible).





## Frontend Setup  

### Project Structure

frontend/
├── components/
│   └── Navbar.jsx          # Navigation bar with logout
├── context/
│   ├── AdminContext.jsx    # Admin login token & backend URL
│   └── AgentContext.jsx    # Agent-related state (currently empty)
├── pages/
│   ├── Login.jsx           # Admin/Agent login page
│   └── Admin and Agent
├── App.jsx                 # Main app, decides whether to show login or dashboard
└── main.jsx                # Entry point, wraps app with context & router


### Key Points

- **AdminContext**  
  - Stores JWT token (`aToken`) and backend URL.  
  - Persists token in `localStorage` for page refresh.  

- **AgentContext**  
  - Currently empty, reserved for agent-specific state.  

- **Login.jsx**  
  - Toggles between Admin and Agent login (currently Admin implemented).  
  - Sends POST request to backend `/api/admin/login`.  
  - Stores JWT token in context & localStorage on successful login.  
  - Displays errors using **React Toastify**.  

- **Navbar.jsx**  
  - Shows admin logo, role badge, and logout button.  
  - Logout clears token from context & localStorage and redirects to login.  
  - Styled with Tailwind for hover effects and gradients.  

- **App.jsx**  
  - If `aToken` exists → show Navbar (protected pages).  
  - If no token → show Login page.  

- **main.jsx**  
  - Wraps App with **AdminContextProvider**, **AgentContextProvider**, and **BrowserRouter**.  


### How It Works
1. Admin visits the login page → enters email & password.  
2. If credentials match `.env`, backend returns a JWT token.  
3. Token is stored in **context** & `localStorage`.  
4. Protected pages (like adding agents) are shown only if token exists.  
5. Logout clears token and redirects to login page.

### Features
-  Admin login with JWT token  
-  Agent management with secure password hashing  
-  React context for state management  
-  Toast notifications for success/error messages  
-  Clean, responsive UI using Tailwind CSS  
-  Role-based route protection  





## frontend 
## 1. Added Routes in App.jsx

Admin routes:

/admin-dashboard → Admin Dashboard page

/add-agent → Add Agent page

/upload-file → Upload File page

Agent routes:

/agent-dashboard → Agent Dashboard page

Conditional rendering:

If aToken exists → show Navbar, Sidebar, and protected routes

If aToken does not exist → show Login page

ToastContainer added globally for notifications


Key Points:

Protected pages are only accessible when aToken exists

Routing is managed using React Router DOM 

## 2. Sidebar Component (Sidebar.jsx)

Displays navigation links for admin:

Dashboard

Add Agent

Upload Agent

Active link highlights with Tailwind styles

Uses NavLink from react-router-dom for route navigation

Conditional rendering based on aToken

Sidebar is responsive and occupies full height (min-h-screen)

Key Points:

Only visible if admin is logged in

Easy to expand for additional routes

Uses icons from assets/ folder for visual cues


## 3. AddAgent Page (AddAgent.jsx)

Form Inputs:

Name

Email

Password

Mobile number (using react-phone-input-2)

Form Features:

Validation: Required fields and password length

Mobile input supports country codes

Placeholder issue handled using proper input props (if needed)

API Integration:

Axios POST request to /api/admin/add-agent

Headers include Authorization: Bearer <token>

Success/error feedback using react-toastify

State Management:

Uses React useState for form inputs

Clears fields after successful submission

Key Points:

Fully integrated with backend agent creation

Secure and responsive form

Mobile input now shows placeholder correctly


## 4. Created Empty Pages for Future Development

AdminDashboard.jsx → placeholder for admin dashboard

UploadFile.jsx → placeholder for file upload functionality

AgentDashboard.jsx → placeholder for agent dashboard

Key Points:

Empty JSX files allow for easy expansion

Keeps project structure clean and modular 


## created User Login 

make and api for user logged in and integrated in frontend and navigate to /agent-dashboard  

# Flow Summary

Agent submits email + password.

Backend validates credentials using bcrypt + JWT.

Token is saved in localStorage (uToken).

React AgentContext is updated with token.

User is redirected to /agent-dashboard. 



## Upload File Feature (CSV/XLSX Upload & Distribution) 

# Frontend Changes (UploadFile.jsx) 
New Page: UploadFile.jsx under pages/

Purpose: Allows admin to upload CSV/XLSX files containing customer lists (FirstName, Phone, Notes).

Key Features:

File input with validation for supported formats (.csv, .xlsx, .xls).

Client-side validation:

Required columns: FirstName, Phone, Notes.

FirstName → must be text

Phone → must be number

Notes → must be text

Preview of parsed rows before submission.

Error messages shown for invalid files/rows.

Submits valid file via axios to backend API (/api/admin/upload-list) with JWT token.

Success/error feedback using React Toastify.

UI:

File input

Preview table with scrollable view (max-h-64)

Validation error messages

Submit button disabled if no valid preview data 


# Backend Changes (File Upload API) 
New Middleware:

middleware/upload.js

Uses multer.memoryStorage() to store uploaded file in memory.

Exports upload for use in routes.

Updated Routes (adminRoute.js): 

adminRouter.post(
  '/upload-list',
  authAdmin,
  upload.single("file"),
  uploadList
)
 
 New Controller Function (uploadList in adminController.js):

Steps Performed:

File Validation

Ensures file is uploaded.

Restricts file types to .csv, .xlsx, .xls.

Parse & Read File

Reads first sheet using xlsx.

Converts to JSON rows.

Header Validation

Required columns: FirstName, Phone, Notes.

Returns error if missing columns.

Row Validation

FirstName → string

Phone → number

Notes → string

Agent Distribution Logic

Fetches first 5 agents from database.

Distributes rows evenly among agents.

Each agent’s assignedData array updated with { firstName, phone, notes }.

Response

Returns success message + distributed data (mapping agent name → assigned rows).


# Key Highlights of Upload Feature

1. End-to-end file validation (frontend + backend).

2.  Prevents invalid file uploads (wrong format, missing columns).

3.  Preview before submit for better UX.

4. Automatically distributes uploaded data evenly among exactly 5 agents.

5. Uses multer.memoryStorage for efficient file handling.

5. Error handling with clear messages (empty file, wrong type, invalid row).
