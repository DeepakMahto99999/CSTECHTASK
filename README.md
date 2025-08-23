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