=============================================================
                    TEAM TASK MANAGER
=============================================================

DESCRIPTION
-----------
Team Task Manager is a full-stack web application that helps
teams organize, assign, and track tasks in real time using a
Kanban-style board. It supports role-based access control
where the first user to sign up becomes the Admin and all
subsequent users are assigned the Member role automatically.


TECH STACK
----------
- Backend    : Node.js
- Database   : SQLite (built-in with Node.js v22+)
- Frontend   : HTML, CSS, JavaScript (Vanilla)
- Auth       : JWT (JSON Web Tokens) in HTTP-only cookies
- Deployment : Railway (Cloud Platform)


FEATURES
--------
1. Role-Based Access Control
   - First user = Admin (automatic)
   - All other users = Member (automatic)
   - No role selection on signup (server-enforced)

2. Admin Capabilities
   - Create and manage projects
   - Add/remove members to projects
   - Create, edit, and delete tasks
   - Assign tasks to team members

3. Member Capabilities
   - View assigned projects and tasks
   - Update task status (move between columns)
   - View dashboard and activity feed

4. Kanban Board
   - Four columns: To Do, In Progress, Review, Done
   - Tasks with title, description, priority, due date
   - Overdue tasks highlighted in red

5. Dashboard
   - Total projects count
   - Total tasks count
   - Overdue tasks count
   - Recent activity feed


PROJECT STRUCTURE
-----------------
team-task-manager/
|-- server.js           (Backend server + API routes)
|-- package.json        (Project dependencies and scripts)
|-- public/
|   |-- index.html      (Main HTML page)
|   |-- app.js          (Frontend JavaScript logic)
|   |-- app.css         (Styles and design)


HOW TO RUN LOCALLY
------------------
1. Make sure you have Node.js v22 or higher installed.
2. Open a terminal and navigate to the project folder.
3. Run the following commands:

   npm install
   npm start

4. Open your browser and go to:
   http://localhost:3000

5. Sign up with your name, email, and password.
   The first account created will be the Admin.


HOW TO DEPLOY
-------------
1. Push the code to a GitHub repository.
2. Go to https://railway.app and sign in with GitHub.
3. Click "New Project" and select "Deploy from GitHub Repo".
4. Select the team-task-manager repository.
5. In the Variables tab, add:
   - JWT_SECRET = any_random_secret_string
6. Railway will automatically build and deploy the app.
7. Generate a public domain from Settings to get a live URL.


API ENDPOINTS
-------------
POST   /api/auth/signup     - Create a new account
POST   /api/auth/login      - Log in to existing account
POST   /api/auth/logout     - Log out
GET    /api/auth/me          - Get current logged-in user

GET    /api/projects         - Get all projects
POST   /api/projects         - Create a new project (Admin)
DELETE /api/projects/:id     - Delete a project (Admin)

GET    /api/projects/:id/tasks    - Get tasks for a project
POST   /api/projects/:id/tasks    - Create a task (Admin)
PUT    /api/tasks/:id             - Update a task
DELETE /api/tasks/:id             - Delete a task (Admin)

GET    /api/users            - Get all users
POST   /api/projects/:id/members  - Add member to project


DEVELOPED BY
------------
Name : Sanskruti Malunjkar
Email: sansmalunjkar05@gmail.com

=============================================================
