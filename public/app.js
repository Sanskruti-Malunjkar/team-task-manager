// Global Application State
const state = {
  user: null,
  projects: [],
  currentProject: null,
  currentProjectTasks: [],
  allUsers: [],
  currentView: 'dashboard',
  selectedTaskId: null // for editing
};

// SVG Icons Collection (Clean, Premium, Modern outline SVGs)
const Icons = {
  logo: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.375c.9 0 1.625-.724 1.625-1.618V12h0c0-.894-.725-1.618-1.625-1.618H9m0 4.5V9a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v5.25a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3Z" /></svg>`,
  dashboard: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" /></svg>`,
  projects: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>`,
  tasks: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>`,
  logout: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>`,
  plus: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l18 12" /></svg>`,
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`,
  overdue: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
  activity: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>`,
  userAdd: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>`,
  user: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>`,
  trash: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>`,
  edit: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>`
};

// Loader and Toast Helpers
const loader = {
  show: () => document.getElementById('loading-overlay').classList.remove('hidden'),
  hide: () => document.getElementById('loading-overlay').classList.add('hidden')
};

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Custom Fetch API Wrapper
async function apiRequest(url, method = 'GET', body = null) {
  try {
    loader.show();
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (body) {
      options.body = JSON.stringify(body);
    }
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }
    return data;
  } catch (error) {
    showToast(error.message, 'error');
    throw error;
  } finally {
    loader.hide();
  }
}

// Date helper to check if task is overdue
function isOverdue(dueDateString) {
  if (!dueDateString) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDateString);
  due.setHours(0, 0, 0, 0);
  return due < today;
}

// User Initials Helper
function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

// Auth operations
async function checkAuth() {
  try {
    const data = await apiRequest('/api/auth/me');
    state.user = data.user;
    return true;
  } catch (e) {
    state.user = null;
    return false;
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;
  try {
    const data = await apiRequest('/api/auth/login', 'POST', { email, password });
    state.user = data.user;
    showToast('Welcome back, ' + data.user.name + '!');
    window.location.hash = '#/dashboard';
  } catch (err) {}
}

async function handleSignup(e) {
  e.preventDefault();
  const name = e.target.name.value;
  const email = e.target.email.value;
  const password = e.target.password.value;
  try {
    const data = await apiRequest('/api/auth/signup', 'POST', { name, email, password });
    state.user = data.user;
    showToast('Account created successfully!');
    window.location.hash = '#/dashboard';
  } catch (err) {}
}

async function handleLogout(e) {
  if (e) e.preventDefault();
  try {
    await apiRequest('/api/auth/logout', 'POST');
    state.user = null;
    showToast('Logged out successfully');
    window.location.hash = '#/login';
  } catch (err) {}
}

// Data loaders
async function loadProjects() {
  try {
    state.projects = await apiRequest('/api/projects');
  } catch (e) {
    state.projects = [];
  }
}

async function loadAllUsers() {
  try {
    state.allUsers = await apiRequest('/api/users');
  } catch (e) {
    state.allUsers = [];
  }
}

// Router & View Controller
async function router() {
  const hash = window.location.hash || '#/dashboard';
  const authenticated = await checkAuth();

  if (!authenticated) {
    if (hash === '#/signup') {
      state.currentView = 'signup';
      renderAuthPage('signup');
    } else {
      state.currentView = 'login';
      renderAuthPage('login');
      window.location.hash = '#/login';
    }
    return;
  }

  // Load baseline projects
  await loadProjects();
  await loadAllUsers();

  const appMount = document.getElementById('app');
  
  // Render outer shell if not already present
  if (!document.querySelector('.app-container')) {
    appMount.innerHTML = `
      <div class="app-container">
        <aside class="sidebar">
          <div class="sidebar-logo">
            ${Icons.logo}
            <span>Task Manager</span>
          </div>
          <nav class="sidebar-nav">
            <a href="#/dashboard" class="nav-link ${hash === '#/dashboard' ? 'active' : ''}" data-view="dashboard">
              ${Icons.dashboard}
              <span>Dashboard</span>
            </a>
            <a href="#/projects" class="nav-link ${hash.startsWith('#/projects') ? 'active' : ''}" data-view="projects">
              ${Icons.projects}
              <span>Projects</span>
            </a>
            <div class="sidebar-divider"></div>
            <div style="padding: 0 10px; margin-bottom: 8px; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
              Active Projects
            </div>
            <div class="sidebar-projects-list" id="sidebar-projects">
              <!-- Rendered Dynamically -->
            </div>
          </nav>
          
          <div class="sidebar-footer">
            <div class="user-badge">
              <div class="user-avatar">${getInitials(state.user.name)}</div>
              <div class="user-info">
                <span class="user-name">${state.user.name}</span>
                <span class="user-role">${state.user.role}</span>
              </div>
            </div>
            <a class="nav-link" id="logout-btn">
              ${Icons.logout}
              <span>Logout</span>
            </a>
          </div>
        </aside>
        
        <main class="main-content" id="main-content-area">
          <!-- Views rendered dynamically here -->
        </main>
      </div>
      
      <!-- Modals Layer -->
      <div id="modal-container-layer"></div>
    `;
    
    // Add logout listener
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
  }

  // Render Project List in Sidebar
  const sidebarProjects = document.getElementById('sidebar-projects');
  if (sidebarProjects) {
    sidebarProjects.innerHTML = state.projects.map(p => `
      <a href="#/projects/${p.id}" class="sidebar-project-item ${hash === `#/projects/${p.id}` ? 'active' : ''}">
        <span class="dot"></span>
        <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px;">${p.name}</span>
      </a>
    `).join('');
  }

  // Handle active class updates
  document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
    const view = link.getAttribute('data-view');
    if (view === 'dashboard' && hash === '#/dashboard') {
      link.classList.add('active');
    } else if (view === 'projects' && hash.startsWith('#/projects')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Render Inner View
  if (hash === '#/dashboard') {
    state.currentView = 'dashboard';
    await renderDashboard();
  } else if (hash === '#/projects') {
    state.currentView = 'projects';
    await renderProjects();
  } else if (hash.startsWith('#/projects/')) {
    state.currentView = 'project-detail';
    const projectId = hash.split('/').pop();
    await renderProjectDetail(projectId);
  } else {
    window.location.hash = '#/dashboard';
  }
}

// Render Authentication Screens
function renderAuthPage(type) {
  const container = document.getElementById('app');
  const isLogin = type === 'login';
  
  container.innerHTML = `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-logo">
            ${Icons.logo}
          </div>
          <h1>${isLogin ? 'Welcome Back' : 'Get Started'}</h1>
          <p>${isLogin ? 'Manage your team tasks smoothly' : 'Sign up to manage and assign tasks'}</p>
        </div>
        
        <form id="auth-form">
          ${!isLogin ? `
            <div class="form-group">
              <label for="name">Full Name</label>
              <input type="text" id="name" name="name" class="form-control" placeholder="e.g. Parth Patel" required>
            </div>
          ` : ''}
          
          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" name="email" class="form-control" placeholder="name@company.com" required>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" class="form-control" placeholder="••••••••" required>
          </div>
          
          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px; padding: 12px;">
            ${isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        
        <div class="auth-footer">
          ${isLogin ? `
            Don't have an account? <a href="#/signup">Sign Up</a>
          ` : `
            Already have an account? <a href="#/login">Sign In</a>
          `}
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('auth-form').addEventListener('submit', isLogin ? handleLogin : handleSignup);
}

// View: Dashboard
async function renderDashboard() {
  const contentArea = document.getElementById('main-content-area');
  
  try {
    const stats = await apiRequest('/api/dashboard');
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    contentArea.innerHTML = `
      <div class="animated-fade">
        <div class="topbar">
          <div class="view-title">
            <h2>Dashboard</h2>
          </div>
        </div>
        
        <div class="dashboard-welcome">
          <h3>Good day, ${state.user.name}</h3>
          <p>${today}</p>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-card-header">
              <span>TOTAL TASKS</span>
              ${Icons.tasks}
            </div>
            <div class="stat-value">${stats.totalTasks}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-header">
              <span>IN PROGRESS</span>
              <span style="color: var(--color-progress)">●</span>
            </div>
            <div class="stat-value">${stats.inProgress}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-header">
              <span>IN REVIEW</span>
              <span style="color: var(--color-review)">●</span>
            </div>
            <div class="stat-value">${stats.inReview}</div>
          </div>
          <div class="stat-card completed">
            <div class="stat-card-header">
              <span>COMPLETED</span>
              <span style="color: var(--color-success)">●</span>
            </div>
            <div class="stat-value">${stats.completed}</div>
          </div>
          <div class="stat-card overdue">
            <div class="stat-card-header">
              <span>OVERDUE</span>
              ${Icons.overdue}
            </div>
            <div class="stat-value">${stats.overdue}</div>
          </div>
        </div>
        
        <div class="dashboard-grid">
          <!-- Left: My Tasks -->
          <div class="dashboard-panel">
            <h3>${Icons.tasks} My Pending Tasks</h3>
            
            <div class="task-list-simple">
              ${stats.myTasks.length === 0 ? `
                <div class="empty-state">
                  ${Icons.tasks}
                  <p>You have no pending tasks assigned to you.</p>
                </div>
              ` : stats.myTasks.map(t => `
                <div class="simple-task-card" onclick="window.location.hash='#/projects/${t.project_id}'">
                  <div class="simple-task-info">
                    <span class="simple-task-title">${t.title}</span>
                    <div class="simple-task-meta">
                      <span>Project: <strong>${t.project_name}</strong></span>
                      <span class="tag tag-priority-${t.priority.toLowerCase()}">${t.priority}</span>
                      ${t.due_date ? `
                        <span class="task-card-date ${isOverdue(t.due_date) ? 'overdue' : ''}">
                          ${Icons.calendar} ${t.due_date}
                        </span>
                      ` : ''}
                    </div>
                  </div>
                  <div style="font-size: 0.8rem; font-weight: 600; padding: 4px 10px; border-radius: var(--radius-sm); background-color: var(--bg-tertiary);">
                    ${t.status}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <!-- Right: Activity Logs -->
          <div class="dashboard-panel">
            <h3>${Icons.activity} Recent Activity Feed</h3>
            
            <div class="activity-feed">
              ${stats.recentActivity.length === 0 ? `
                <div class="empty-state">
                  ${Icons.activity}
                  <p>No recent workspace activities.</p>
                </div>
              ` : stats.recentActivity.map(log => `
                <div class="activity-item">
                  <div class="activity-dot-wrapper">
                    <div class="activity-dot"></div>
                    <div class="activity-line"></div>
                  </div>
                  <div class="activity-content">
                    <div class="activity-text">
                      <strong>${log.user_name}</strong>: ${log.action}
                      <div style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 2px;">
                        Project: ${log.project_name}
                      </div>
                    </div>
                    <span class="activity-time">${new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  } catch (e) {
    contentArea.innerHTML = `<div class="empty-state"><p>Error loading dashboard statistics.</p></div>`;
  }
}

// View: Projects List
async function renderProjects() {
  const contentArea = document.getElementById('main-content-area');
  
  contentArea.innerHTML = `
    <div class="animated-fade">
      <div class="topbar">
        <div class="view-title">
          <h2>Projects</h2>
        </div>
        ${state.user.role === 'Admin' ? `
          <div class="topbar-actions">
            <button class="btn btn-primary" id="btn-create-project">
              ${Icons.plus} New Project
            </button>
          </div>
        ` : ''}
      </div>
      
      <div class="projects-grid" id="projects-list-container">
        ${state.projects.length === 0 ? `
          <div class="empty-state" style="grid-column: 1 / -1;">
            ${Icons.projects}
            <p>No projects found. Create one to get started!</p>
          </div>
        ` : state.projects.map(p => `
          <div class="project-card" onclick="window.location.hash='#/projects/${p.id}'">
            <div class="project-card-title">
              <span>${p.name}</span>
              ${Icons.projects}
            </div>
            <div class="project-card-desc">${p.description || 'No description provided.'}</div>
            <div class="project-card-footer">
              <span class="project-card-owner">By ${p.creator_name}</span>
              <span>Open Board →</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  const btnCreateProj = document.getElementById('btn-create-project');
  if (btnCreateProj) {
    btnCreateProj.addEventListener('click', showCreateProjectModal);
  }
}

// View: Project Detail (Kanban Board)
async function renderProjectDetail(projectId) {
  const contentArea = document.getElementById('main-content-area');
  
  try {
    // Load Project details, tasks and members
    const project = state.projects.find(p => p.id === parseInt(projectId, 10));
    if (!project) {
      contentArea.innerHTML = `<div class="empty-state"><p>Project not found.</p></div>`;
      return;
    }
    
    state.currentProject = project;
    state.currentProjectTasks = await apiRequest(`/api/projects/${projectId}/tasks`);
    const members = await apiRequest(`/api/projects/${projectId}/members`);
    
    // Check if user is admin/owner
    const isProjectAdmin = state.user.role === 'Admin' || project.created_by === state.user.id || members.some(m => m.id === state.user.id && m.role === 'Admin');
    
    // Split tasks by column
    const todoTasks = state.currentProjectTasks.filter(t => t.status === 'To Do');
    const progressTasks = state.currentProjectTasks.filter(t => t.status === 'In Progress');
    const reviewTasks = state.currentProjectTasks.filter(t => t.status === 'In Review');
    const completedTasks = state.currentProjectTasks.filter(t => t.status === 'Completed');
    
    contentArea.innerHTML = `
      <div class="animated-fade" style="display: flex; flex-direction: column; flex-grow: 1;">
        <div class="project-detail-header">
          <div class="project-details-info">
            <h2 style="font-size: 1.85rem; font-weight: 800; letter-spacing: -0.02em;">${project.name}</h2>
            <p>${project.description || 'No project description.'}</p>
            
            <div class="project-team">
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">Project Members:</span>
              <div class="team-members-list">
                ${members.map(m => `
                  <div class="member-pill" title="${m.name} (${m.role})">${getInitials(m.name)}</div>
                `).join('')}
                ${isProjectAdmin ? `
                  <button class="add-member-pill-btn" id="btn-add-member" title="Invite User">+</button>
                ` : ''}
              </div>
            </div>
          </div>
          
          ${isProjectAdmin ? `
            <button class="btn btn-primary" id="btn-create-task">
              ${Icons.plus} Add Task
            </button>
          ` : ''}
        </div>
        
        <!-- Kanban Board Layout -->
        <div class="kanban-board">
          <!-- TO DO Column -->
          <div class="kanban-column">
            <div class="kanban-column-header">
              <div class="kanban-column-title todo">
                <span class="dot"></span>
                <span>To Do</span>
              </div>
              <span class="kanban-column-count">${todoTasks.length}</span>
            </div>
            <div class="kanban-cards-container" data-status="To Do">
              ${renderTaskCards(todoTasks)}
            </div>
          </div>
          
          <!-- IN PROGRESS Column -->
          <div class="kanban-column">
            <div class="kanban-column-header">
              <div class="kanban-column-title progress">
                <span class="dot"></span>
                <span>In Progress</span>
              </div>
              <span class="kanban-column-count">${progressTasks.length}</span>
            </div>
            <div class="kanban-cards-container" data-status="In Progress">
              ${renderTaskCards(progressTasks)}
            </div>
          </div>
          
          <!-- IN REVIEW Column -->
          <div class="kanban-column">
            <div class="kanban-column-header">
              <div class="kanban-column-title review">
                <span class="dot"></span>
                <span>In Review</span>
              </div>
              <span class="kanban-column-count">${reviewTasks.length}</span>
            </div>
            <div class="kanban-cards-container" data-status="In Review">
              ${renderTaskCards(reviewTasks)}
            </div>
          </div>
          
          <!-- COMPLETED Column -->
          <div class="kanban-column">
            <div class="kanban-column-header">
              <div class="kanban-column-title completed">
                <span class="dot"></span>
                <span>Completed</span>
              </div>
              <span class="kanban-column-count">${completedTasks.length}</span>
            </div>
            <div class="kanban-cards-container" data-status="Completed">
              ${renderTaskCards(completedTasks)}
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Add Click Handlers for cards
    document.querySelectorAll('.task-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const taskId = card.getAttribute('data-task-id');
        showTaskModal(taskId);
      });
    });

    const btnCreateTask = document.getElementById('btn-create-task');
    if (btnCreateTask) {
      btnCreateTask.addEventListener('click', () => showTaskModal());
    }
    if (isProjectAdmin) {
      const btnAddMem = document.getElementById('btn-add-member');
      if (btnAddMem) {
        btnAddMem.addEventListener('click', () => showAddMemberModal(members));
      }
    }

  } catch (e) {
    contentArea.innerHTML = `<div class="empty-state"><p>Error loading project details.</p></div>`;
  }
}

// Render Card List
function renderTaskCards(tasks) {
  if (tasks.length === 0) {
    return `<div class="empty-state" style="padding: 20px; font-size: 0.8rem;">No Tasks</div>`;
  }
  return tasks.map(t => {
    const overdueClass = (t.status !== 'Completed' && isOverdue(t.due_date)) ? 'overdue' : '';
    return `
      <div class="task-card" data-task-id="${t.id}">
        <div class="task-card-header">
          <span class="task-card-title">${t.title}</span>
          <span class="tag tag-priority-${t.priority.toLowerCase()}">${t.priority}</span>
        </div>
        ${t.description ? `<p class="task-card-desc">${t.description}</p>` : ''}
        <div class="task-card-footer">
          <div class="task-card-date ${overdueClass}">
            ${Icons.calendar}
            <span>${t.due_date || 'No Date'}</span>
          </div>
          <div class="task-card-assignee" title="Assignee: ${t.assignee_name || 'Unassigned'}">
            ${t.assignee_name ? getInitials(t.assignee_name) : '?'}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// MODAL: Create Project
function showCreateProjectModal() {
  const modalContainer = document.getElementById('modal-container-layer');
  modalContainer.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Create New Project</h3>
          <button class="modal-close" id="modal-close-btn">${Icons.close}</button>
        </div>
        <form id="create-project-form">
          <div class="modal-body">
            <div class="form-group">
              <label for="proj-name">Project Name</label>
              <input type="text" id="proj-name" name="name" class="form-control" placeholder="e.g. Website Redevelopment" required>
            </div>
            <div class="form-group">
              <label for="proj-desc">Description</label>
              <textarea id="proj-desc" name="description" class="form-control" rows="3" placeholder="Provide a brief project description..."></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
            <button type="submit" class="btn btn-primary">Create Project</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  const closeModal = () => modalContainer.innerHTML = '';
  document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  document.getElementById('modal-cancel-btn').addEventListener('click', closeModal);
  
  document.getElementById('create-project-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const description = e.target.description.value;
    try {
      const proj = await apiRequest('/api/projects', 'POST', { name, description });
      showToast(`Project "${proj.name}" created!`);
      closeModal();
      await loadProjects();
      window.location.hash = `#/projects/${proj.id}`;
    } catch (err) {}
  });
}

// MODAL: Add Team Member
function showAddMemberModal(currentMembers) {
  const modalContainer = document.getElementById('modal-container-layer');
  const nonMembers = state.allUsers.filter(u => !currentMembers.some(m => m.id === u.id));
  
  modalContainer.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Invite Project Member</h3>
          <button class="modal-close" id="modal-close-btn">${Icons.close}</button>
        </div>
        <form id="add-member-form">
          <div class="modal-body">
            <div class="form-group">
              <label for="member-select">Select User</label>
              <select id="member-select" name="userId" class="form-control form-select" required>
                <option value="">-- Choose Workspace Member --</option>
                ${nonMembers.map(u => `
                  <option value="${u.id}">${u.name} (${u.email})</option>
                `).join('')}
              </select>
            </div>
            <div class="form-group">
              <label for="member-role">Project Role</label>
              <select id="member-role" name="role" class="form-control form-select" required>
                <option value="Member" selected>Member</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
            <button type="submit" class="btn btn-primary">Add Member</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  const closeModal = () => modalContainer.innerHTML = '';
  document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  document.getElementById('modal-cancel-btn').addEventListener('click', closeModal);
  
  document.getElementById('add-member-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = parseInt(e.target.userId.value, 10);
    const role = e.target.role.value;
    try {
      await apiRequest(`/api/projects/${state.currentProject.id}/members`, 'POST', { userId, role });
      showToast('Member added successfully!');
      closeModal();
      await router();
    } catch (err) {}
  });
}

// MODAL: Create / Edit Task
async function showTaskModal(taskId = null) {
  const modalContainer = document.getElementById('modal-container-layer');
  const projectMembers = await apiRequest(`/api/projects/${state.currentProject.id}/members`);
  
  let task = null;
  const isEdit = taskId !== null;
  
  if (isEdit) {
    task = state.currentProjectTasks.find(t => t.id === parseInt(taskId, 10));
  }
  
  // Verify permissions: Must be workspace Admin or project Admin to edit details/delete
  const isProjectAdmin = state.user.role === 'Admin' || 
                        state.currentProject.created_by === state.user.id || 
                        projectMembers.some(m => m.id === state.user.id && m.role === 'Admin');
  
  const attr = isProjectAdmin ? '' : 'disabled';
  
  modalContainer.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3>${isEdit ? (isProjectAdmin ? 'Edit Task Details' : 'View Task (Status Only)') : 'Create Task'}</h3>
          <button class="modal-close" id="modal-close-btn">${Icons.close}</button>
        </div>
        <form id="task-form">
          <div class="modal-body">
            <div class="form-group">
              <label for="task-title">Task Title</label>
              <input type="text" id="task-title" name="title" class="form-control" placeholder="Task Name" value="${task ? task.title : ''}" required ${attr}>
            </div>
            
            <div class="form-group">
              <label for="task-desc">Description</label>
              <textarea id="task-desc" name="description" class="form-control" rows="3" placeholder="Provide description..." ${attr}>${task && task.description ? task.description : ''}</textarea>
            </div>
            
            <div class="form-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div>
                <label for="task-status">Status</label>
                <select id="task-status" name="status" class="form-control form-select" required>
                  <option value="To Do" ${task && task.status === 'To Do' ? 'selected' : ''}>To Do</option>
                  <option value="In Progress" ${task && task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                  <option value="In Review" ${task && task.status === 'In Review' ? 'selected' : ''}>In Review</option>
                  <option value="Completed" ${task && task.status === 'Completed' ? 'selected' : ''}>Completed</option>
                </select>
              </div>
              
              <div>
                <label for="task-priority">Priority</label>
                <select id="task-priority" name="priority" class="form-control form-select" required ${attr}>
                  <option value="Low" ${task && task.priority === 'Low' ? 'selected' : ''}>Low</option>
                  <option value="Medium" ${task && task.priority === 'Medium' ? 'selected' : 'selected'}>Medium</option>
                  <option value="High" ${task && task.priority === 'High' ? 'selected' : ''}>High</option>
                </select>
              </div>
            </div>
            
            <div class="form-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div>
                <label for="task-assignee">Assignee</label>
                <select id="task-assignee" name="assigneeId" class="form-control form-select" ${attr}>
                  <option value="">Unassigned</option>
                  ${projectMembers.map(m => `
                    <option value="${m.id}" ${task && task.assignee_id === m.id ? 'selected' : ''}>${m.name}</option>
                  `).join('')}
                </select>
              </div>
              
              <div>
                <label for="task-due">Due Date</label>
                <input type="date" id="task-due" name="dueDate" class="form-control" value="${task ? task.due_date : ''}" ${attr}>
              </div>
            </div>
          </div>
          <div class="modal-footer" style="justify-content: space-between;">
            <div>
              ${(isEdit && isProjectAdmin) ? `
                <button type="button" class="btn btn-danger" id="task-delete-btn">
                  ${Icons.trash} Delete
                </button>
              ` : ''}
            </div>
            <div style="display: flex; gap: 12px;">
              <button type="button" class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
              <button type="submit" class="btn btn-primary">${isEdit ? 'Save Changes' : 'Create Task'}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `;
  
  const closeModal = () => modalContainer.innerHTML = '';
  document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  document.getElementById('modal-cancel-btn').addEventListener('click', closeModal);
  
  if (isEdit && isProjectAdmin) {
    const deleteBtn = document.getElementById('task-delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this task?')) {
          try {
            await apiRequest(`/api/tasks/${taskId}`, 'DELETE');
            showToast('Task deleted successfully');
            closeModal();
            await router();
          } catch (err) {}
        }
      });
    }
  }
  
  document.getElementById('task-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      title: e.target.title.value,
      description: e.target.description.value,
      status: e.target.status.value,
      priority: e.target.priority.value,
      assigneeId: e.target.assigneeId.value || null,
      dueDate: e.target.dueDate.value
    };
    
    try {
      if (isEdit) {
        await apiRequest(`/api/tasks/${taskId}`, 'PUT', payload);
        showToast('Task updated successfully!');
      } else {
        await apiRequest(`/api/projects/${state.currentProject.id}/tasks`, 'POST', payload);
        showToast('Task created successfully!');
      }
      closeModal();
      await router();
    } catch (err) {}
  });
}

// Global Event Listeners & Init
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);
