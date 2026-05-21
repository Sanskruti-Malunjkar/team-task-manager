import { createServer } from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const DB_PATH = process.env.DB_PATH || (process.platform === 'win32' ? 'C:\\Users\\PARTH\\database.db' : path.join(__dirname, 'database.db'));
const PUBLIC_DIR = path.join(__dirname, 'public');

// Initialize Database
const db = new DatabaseSync(DB_PATH);
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('Admin', 'Member')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(created_by) REFERENCES users(id)
  );
  
  CREATE TABLE IF NOT EXISTS project_members (
    project_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('Admin', 'Member')),
    PRIMARY KEY(project_id, user_id),
    FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    assignee_id INTEGER,
    status TEXT NOT NULL CHECK(status IN ('To Do', 'In Progress', 'In Review', 'Completed')),
    priority TEXT NOT NULL CHECK(priority IN ('Low', 'Medium', 'High')),
    due_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY(assignee_id) REFERENCES users(id) ON DELETE SET NULL
  );
  
  CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Secret Key for Signing JWT Session Tokens
const JWT_SECRET = process.env.JWT_SECRET || 'team-task-manager-secret-token-key-2026-fresh-aesthetic';

// Hashing Passwords via pbkdf2Sync (standard in crypto)
function hashPassword(password) {
  const salt = 'fresh_team_task_manager_salt_98765';
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

// Token functions
function generateToken(user) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000 // 1 day
  })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${signature}`;
}

function verifyToken(token) {
  if (!token) return null;
  try {
    const [header, payload, signature] = token.split('.');
    const expectedSignature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${payload}`).digest('base64url');
    if (signature !== expectedSignature) return null;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (data.exp < Date.now()) return null;
    return data;
  } catch (e) {
    return null;
  }
}

// Cookies Parsing
function getCookies(req) {
  const list = {};
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach(cookie => {
    let [name, ...rest] = cookie.split('=');
    name = name.trim();
    if (!name) return;
    const val = rest.join('=').trim();
    list[name] = decodeURIComponent(val);
  });
  return list;
}

// Read request body JSON
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', err => reject(err));
  });
}

// Helper to respond JSON
function sendJSON(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// Middleware: Authenticate Request
function authenticate(req, res) {
  const cookies = getCookies(req);
  const token = cookies.auth_token;
  const user = verifyToken(token);
  if (!user) {
    return null;
  }
  return user;
}

// Serve HTTP Request
const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  const method = req.method;

  try {
    // ---------------- AUTHENTICATION ENDPOINTS ----------------
    if (pathname === '/api/auth/signup' && method === 'POST') {
      const { name, email, password, role } = await readBody(req);
      if (!name || !email || !password) {
        return sendJSON(res, 400, { error: 'Name, email and password are required' });
      }

      // Check if user exists
      const userExists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
      if (userExists) {
        return sendJSON(res, 400, { error: 'Email already registered' });
      }

      // First user is Admin, others default to Member unless explicitly requested (e.g. for testing)
      const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
      const assignedRole = userCount === 0 ? 'Admin' : (role === 'Admin' || role === 'Member' ? role : 'Member');

      const passwordHash = hashPassword(password);
      const insert = db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)');
      const result = insert.run(name, email, passwordHash, assignedRole);

      const user = { id: result.lastInsertRowid, name, email, role: assignedRole };
      const token = generateToken(user);

      res.writeHead(201, {
        'Set-Cookie': `auth_token=${token}; Path=/; HttpOnly; Max-Age=86400; SameSite=Strict`,
        'Content-Type': 'application/json'
      });
      return res.end(JSON.stringify({ message: 'Signup successful', user }));
    }

    if (pathname === '/api/auth/login' && method === 'POST') {
      const { email, password } = await readBody(req);
      if (!email || !password) {
        return sendJSON(res, 400, { error: 'Email and password are required' });
      }

      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      if (!user) {
        return sendJSON(res, 401, { error: 'Invalid email or password' });
      }

      if (user.password_hash !== hashPassword(password)) {
        return sendJSON(res, 401, { error: 'Invalid email or password' });
      }

      const tokenPayload = { id: user.id, name: user.name, email: user.email, role: user.role };
      const token = generateToken(tokenPayload);

      res.writeHead(200, {
        'Set-Cookie': `auth_token=${token}; Path=/; HttpOnly; Max-Age=86400; SameSite=Strict`,
        'Content-Type': 'application/json'
      });
      return res.end(JSON.stringify({ message: 'Login successful', user: tokenPayload }));
    }

    if (pathname === '/api/auth/logout' && method === 'POST') {
      res.writeHead(200, {
        'Set-Cookie': 'auth_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict',
        'Content-Type': 'application/json'
      });
      return res.end(JSON.stringify({ message: 'Logout successful' }));
    }

    if (pathname === '/api/auth/me' && method === 'GET') {
      const user = authenticate(req, res);
      if (!user) {
        return sendJSON(res, 401, { error: 'Unauthorized' });
      }
      return sendJSON(res, 200, { user });
    }

    // ---------------- AUTHENTICATED AREA ----------------
    const currentUser = authenticate(req, res);

    if (pathname.startsWith('/api/')) {
      if (!currentUser) {
        return sendJSON(res, 401, { error: 'Unauthorized' });
      }
    }

    // ---------------- USER DIRECTORY ----------------
    if (pathname === '/api/users' && method === 'GET') {
      const users = db.prepare('SELECT id, name, email, role FROM users').all();
      return sendJSON(res, 200, users);
    }

    // ---------------- PROJECT ENDPOINTS ----------------
    if (pathname === '/api/projects' && method === 'GET') {
      // Get projects where user is creator OR a member
      const projects = db.prepare(`
        SELECT p.*, u.name as creator_name 
        FROM projects p
        JOIN users u ON p.created_by = u.id
        WHERE p.created_by = ? 
           OR p.id IN (SELECT project_id FROM project_members WHERE user_id = ?)
        ORDER BY p.created_at DESC
      `).all(currentUser.id, currentUser.id);

      return sendJSON(res, 200, projects);
    }

    if (pathname === '/api/projects' && method === 'POST') {
      if (currentUser.role !== 'Admin') {
        return sendJSON(res, 403, { error: 'Forbidden: Only Admins can create new projects' });
      }
      const { name, description } = await readBody(req);
      if (!name) {
        return sendJSON(res, 400, { error: 'Project name is required' });
      }

      const insert = db.prepare('INSERT INTO projects (name, description, created_by) VALUES (?, ?, ?)');
      const result = insert.run(name, description || '', currentUser.id);
      const projectId = result.lastInsertRowid;

      // Automatically add creator as Admin of the project
      db.prepare('INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)')
        .run(projectId, currentUser.id, 'Admin');

      // Log activity
      db.prepare('INSERT INTO activity_logs (project_id, user_id, action) VALUES (?, ?, ?)')
        .run(projectId, currentUser.id, `Created project "${name}"`);

      return sendJSON(res, 201, { id: projectId, name, description, created_by: currentUser.id });
    }

    // Add members to project
    const matchMembers = pathname.match(/^\/api\/projects\/(\d+)\/members$/);
    if (matchMembers && method === 'POST') {
      const projectId = parseInt(matchMembers[1], 10);
      const { userId, role } = await readBody(req);
      
      if (!userId) {
        return sendJSON(res, 400, { error: 'User ID is required' });
      }

      // Check permissions: Current user must be Admin in the project, or Admin of the workspace
      const memberInfo = db.prepare('SELECT role FROM project_members WHERE project_id = ? AND user_id = ?').get(projectId, currentUser.id);
      const isProjectCreator = db.prepare('SELECT created_by FROM projects WHERE id = ?').get(projectId)?.created_by === currentUser.id;
      
      if (currentUser.role !== 'Admin' && !isProjectCreator && (!memberInfo || memberInfo.role !== 'Admin')) {
        return sendJSON(res, 403, { error: 'Forbidden: Admin access required to add members' });
      }

      const memberRole = role === 'Admin' || role === 'Member' ? role : 'Member';
      
      try {
        db.prepare('INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)')
          .run(projectId, userId, memberRole);

        const addedUser = db.prepare('SELECT name FROM users WHERE id = ?').get(userId);
        db.prepare('INSERT INTO activity_logs (project_id, user_id, action) VALUES (?, ?, ?)')
          .run(projectId, currentUser.id, `Added member "${addedUser.name}" to the project`);

        return sendJSON(res, 200, { message: 'Member added successfully' });
      } catch (e) {
        return sendJSON(res, 400, { error: 'User is already a member of this project' });
      }
    }

    // List project members
    if (matchMembers && method === 'GET') {
      const projectId = parseInt(matchMembers[1], 10);
      const members = db.prepare(`
        SELECT u.id, u.name, u.email, pm.role 
        FROM project_members pm
        JOIN users u ON pm.user_id = u.id
        WHERE pm.project_id = ?
      `).all(projectId);
      return sendJSON(res, 200, members);
    }

    // ---------------- TASK ENDPOINTS ----------------
    // Get Tasks of a Project
    const matchTasks = pathname.match(/^\/api\/projects\/(\d+)\/tasks$/);
    if (matchTasks && method === 'GET') {
      const projectId = parseInt(matchTasks[1], 10);
      const tasks = db.prepare(`
        SELECT t.*, u.name as assignee_name 
        FROM tasks t
        LEFT JOIN users u ON t.assignee_id = u.id
        WHERE t.project_id = ?
        ORDER BY t.created_at DESC
      `).all(projectId);
      return sendJSON(res, 200, tasks);
    }

    // Add Task to a Project
    if (matchTasks && method === 'POST') {
      const projectId = parseInt(matchTasks[1], 10);
      
      // Check permissions: Must be Admin of the project or workspace
      const memberInfo = db.prepare('SELECT role FROM project_members WHERE project_id = ? AND user_id = ?').get(projectId, currentUser.id);
      const isProjectAdmin = currentUser.role === 'Admin' || (memberInfo && memberInfo.role === 'Admin');
      if (!isProjectAdmin) {
        return sendJSON(res, 403, { error: 'Forbidden: Only Admins can create tasks' });
      }

      const { title, description, assigneeId, status, priority, dueDate } = await readBody(req);

      if (!title) {
        return sendJSON(res, 400, { error: 'Task title is required' });
      }

      const taskStatus = status || 'To Do';
      const taskPriority = priority || 'Medium';
      const taskDueDate = dueDate || '';
      const taskAssignee = assigneeId ? parseInt(assigneeId, 10) : null;

      const result = db.prepare(`
        INSERT INTO tasks (project_id, title, description, assignee_id, status, priority, due_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(projectId, title, description || '', taskAssignee, taskStatus, taskPriority, taskDueDate);

      db.prepare('INSERT INTO activity_logs (project_id, user_id, action) VALUES (?, ?, ?)')
        .run(projectId, currentUser.id, `Created task "${title}"`);

      return sendJSON(res, 201, {
        id: result.lastInsertRowid,
        project_id: projectId,
        title,
        description,
        assignee_id: taskAssignee,
        status: taskStatus,
        priority: taskPriority,
        due_date: taskDueDate
      });
    }

    // Update individual Task
    const matchTaskUpdate = pathname.match(/^\/api\/tasks\/(\d+)$/);
    if (matchTaskUpdate && method === 'PUT') {
      const taskId = parseInt(matchTaskUpdate[1], 10);
      const { title, description, assigneeId, status, priority, dueDate } = await readBody(req);
      
      const currentTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
      if (!currentTask) {
        return sendJSON(res, 404, { error: 'Task not found' });
      }

      // Check permissions: Workspace/Project Admins can edit everything, Members can only update status
      const memberInfo = db.prepare('SELECT role FROM project_members WHERE project_id = ? AND user_id = ?').get(currentTask.project_id, currentUser.id);
      const isProjectAdmin = currentUser.role === 'Admin' || (memberInfo && memberInfo.role === 'Admin');

      const updTitle = (isProjectAdmin && title !== undefined) ? title : currentTask.title;
      const updDesc = (isProjectAdmin && description !== undefined) ? description : currentTask.description;
      const updAssignee = (isProjectAdmin && assigneeId !== undefined) ? (assigneeId ? parseInt(assigneeId, 10) : null) : currentTask.assignee_id;
      const updStatus = status !== undefined ? status : currentTask.status;
      const updPriority = (isProjectAdmin && priority !== undefined) ? priority : currentTask.priority;
      const updDueDate = (isProjectAdmin && dueDate !== undefined) ? dueDate : currentTask.due_date;

      db.prepare(`
        UPDATE tasks 
        SET title = ?, description = ?, assignee_id = ?, status = ?, priority = ?, due_date = ?
        WHERE id = ?
      `).run(updTitle, updDesc, updAssignee, updStatus, updPriority, updDueDate, taskId);

      // Log status changes
      if (updStatus !== currentTask.status) {
        db.prepare('INSERT INTO activity_logs (project_id, user_id, action) VALUES (?, ?, ?)')
          .run(currentTask.project_id, currentUser.id, `Changed status of task "${updTitle}" to "${updStatus}"`);
      } else {
        db.prepare('INSERT INTO activity_logs (project_id, user_id, action) VALUES (?, ?, ?)')
          .run(currentTask.project_id, currentUser.id, `Updated task "${updTitle}"`);
      }

      return sendJSON(res, 200, { message: 'Task updated successfully' });
    }

    // Delete Task
    if (matchTaskUpdate && method === 'DELETE') {
      const taskId = parseInt(matchTaskUpdate[1], 10);
      const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
      if (!task) {
        return sendJSON(res, 404, { error: 'Task not found' });
      }

      // Check permissions: Must be workspace or project admin to delete
      const memberInfo = db.prepare('SELECT role FROM project_members WHERE project_id = ? AND user_id = ?').get(task.project_id, currentUser.id);
      const isProjectAdmin = currentUser.role === 'Admin' || (memberInfo && memberInfo.role === 'Admin');
      if (!isProjectAdmin) {
        return sendJSON(res, 403, { error: 'Forbidden: Only Admins can delete tasks' });
      }

      db.prepare('DELETE FROM tasks WHERE id = ?').run(taskId);
      
      db.prepare('INSERT INTO activity_logs (project_id, user_id, action) VALUES (?, ?, ?)')
        .run(task.project_id, currentUser.id, `Deleted task "${task.title}"`);

      return sendJSON(res, 200, { message: 'Task deleted successfully' });
    }

    // ---------------- DASHBOARD API ----------------
    if (pathname === '/api/dashboard' && method === 'GET') {
      const today = new Date().toISOString().split('T')[0];

      // Get project list where user belongs
      const myProjects = db.prepare(`
        SELECT id FROM projects 
        WHERE created_by = ? 
           OR id IN (SELECT project_id FROM project_members WHERE user_id = ?)
      `).all(currentUser.id, currentUser.id).map(p => p.id);

      if (myProjects.length === 0) {
        return sendJSON(res, 200, {
          totalTasks: 0,
          todo: 0,
          inProgress: 0,
          inReview: 0,
          completed: 0,
          overdue: 0,
          myTasks: [],
          recentActivity: []
        });
      }

      const placeholders = myProjects.map(() => '?').join(',');

      // Summary Stats
      const totalTasks = db.prepare(`SELECT COUNT(*) as count FROM tasks WHERE project_id IN (${placeholders})`).get(...myProjects).count;
      const todo = db.prepare(`SELECT COUNT(*) as count FROM tasks WHERE status = 'To Do' AND project_id IN (${placeholders})`).get(...myProjects).count;
      const inProgress = db.prepare(`SELECT COUNT(*) as count FROM tasks WHERE status = 'In Progress' AND project_id IN (${placeholders})`).get(...myProjects).count;
      const inReview = db.prepare(`SELECT COUNT(*) as count FROM tasks WHERE status = 'In Review' AND project_id IN (${placeholders})`).get(...myProjects).count;
      const completed = db.prepare(`SELECT COUNT(*) as count FROM tasks WHERE status = 'Completed' AND project_id IN (${placeholders})`).get(...myProjects).count;

      // Overdue Tasks
      const overdue = db.prepare(`
        SELECT COUNT(*) as count FROM tasks 
        WHERE status != 'Completed' 
          AND due_date != '' 
          AND due_date < ?
          AND project_id IN (${placeholders})
      `).get(today, ...myProjects).count;

      // User's own assigned tasks
      const myTasks = db.prepare(`
        SELECT t.*, p.name as project_name 
        FROM tasks t
        JOIN projects p ON t.project_id = p.id
        WHERE t.assignee_id = ? AND t.status != 'Completed'
        ORDER BY t.due_date ASC
      `).all(currentUser.id);

      // Recent Activity logs across projects
      const recentActivity = db.prepare(`
        SELECT l.*, u.name as user_name, p.name as project_name
        FROM activity_logs l
        JOIN users u ON l.user_id = u.id
        JOIN projects p ON l.project_id = p.id
        WHERE l.project_id IN (${placeholders})
        ORDER BY l.timestamp DESC
        LIMIT 10
      `).all(...myProjects);

      return sendJSON(res, 200, {
        totalTasks,
        todo,
        inProgress,
        inReview,
        completed,
        overdue,
        myTasks,
        recentActivity
      });
    }

    // ---------------- STATIC FILE SERVER ----------------
    if (method === 'GET') {
      let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
      
      // Basic Path Traversal Defense
      const relative = path.relative(PUBLIC_DIR, filePath);
      const isSafe = relative && !relative.startsWith('..') && !path.isAbsolute(relative);
      
      if (!isSafe && pathname !== '/') {
        return sendJSON(res, 403, { error: 'Forbidden' });
      }

      fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
          // SPA routing: Serve index.html if request is not an API call
          if (!pathname.startsWith('/api/')) {
            filePath = path.join(PUBLIC_DIR, 'index.html');
            fs.readFile(filePath, (readErr, content) => {
              if (readErr) {
                res.writeHead(500);
                res.end('Error loading index.html');
              } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content, 'utf-8');
              }
            });
          } else {
            sendJSON(res, 404, { error: 'Not Found' });
          }
          return;
        }

        // Map extensions to content types
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
          '.html': 'text/html',
          '.js': 'text/javascript',
          '.css': 'text/css',
          '.json': 'application/json',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.gif': 'image/gif',
          '.svg': 'image/svg+xml',
          '.ico': 'image/x-icon'
        };

        const contentType = mimeTypes[ext] || 'application/octet-stream';
        fs.readFile(filePath, (readErr, content) => {
          if (readErr) {
            res.writeHead(500);
            res.end(`Server Error: ${readErr.code}`);
          } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
          }
        });
      });
    } else {
      sendJSON(res, 405, { error: 'Method Not Allowed' });
    }

  } catch (error) {
    console.error('Server error:', error);
    sendJSON(res, 500, { error: 'Internal Server Error', message: error.message });
  }
});

// Run Server
server.listen(PORT, () => {
  console.log(`================================================`);
  console.log(`🚀 Team Task Manager is running on port ${PORT}`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`📁 Database path: ${DB_PATH}`);
  console.log(`================================================`);
});
