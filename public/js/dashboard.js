const taskList = document.getElementById("taskList");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

const searchButton = document.getElementById("searchButton");
const resetButton = document.getElementById("resetButton");

const errorMessage = document.getElementById("errorMessage");

// Escape HTML to prevent task text from being interpreted as HTML
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const replacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return replacements[character];
  });
}

// Convert task status into CSS class
function getStatusClass(status) {
  if (status === "Pending") {
    return "status-pending";
  }

  if (status === "In Progress") {
    return "status-in-progress";
  }

  if (status === "Completed") {
    return "status-completed";
  }

  return "";
}

// Check whether a task is overdue
function isOverdue(task) {
  if (task.status === "Completed") {
    return false;
  }

  if (!task.dueDate) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(task.dueDate + "T00:00:00");

  return dueDate < today;
}

// Display tasks
function displayTasks(tasks) {
  taskList.innerHTML = "";

  // If no tasks found
  if (tasks.length === 0) {
    taskList.innerHTML = `
            <div class="empty-state">
                <h3>No tasks found</h3>
                <p>Try changing your search or filter.</p>
            </div>
        `;

    return;
  }

  tasks.forEach((task) => {
    const taskCard = document.createElement("div");

    taskCard.className = "task-card";

    // Status badge
    let statusClass = getStatusClass(task.status);

    let statusText = task.status;

    if (isOverdue(task)) {
      statusClass = "status-overdue";
      statusText = "Overdue";
    }

    // Priority class
    const priorityClass = "priority-" + String(task.priority).toLowerCase();

    taskCard.innerHTML = `
            <div class="task-info">

                <h4>${escapeHTML(task.title)}</h4>

                <p class="task-description">
                    ${escapeHTML(task.description)}
                </p>

                <div class="task-meta">

                    <p>
                        Category:
                        ${escapeHTML(task.category)}
                    </p>

                    <p>
                        Due:
                        ${escapeHTML(task.dueDate)}
                    </p>

                </div>

            </div>

            <div class="task-right">

                <span class="status ${statusClass}">
                    ${escapeHTML(statusText)}
                </span>

                <span class="priority ${priorityClass}">
                    ${escapeHTML(task.priority)} Priority
                </span>

            </div>
        `;

    taskList.appendChild(taskCard);
  });
}

// Retrieve tasks from backend
async function loadTasks() {
  errorMessage.innerHTML = "";

  const search = searchInput.value.trim();
  const status = statusFilter.value;

  // Frontend validation
  if (search.length > 100) {
    errorMessage.innerHTML = `
            <div class="alert alert-error">
                Search must not exceed 100 characters.
            </div>
        `;

    return;
  }

  // Build query parameters
  const params = new URLSearchParams();

  if (search) {
    params.append("search", search);
  }

  if (status) {
    params.append("status", status);
  }

  try {
    const response = await fetch(`/api/tasks?${params.toString()}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    displayTasks(data.tasks);
  } catch (error) {
    errorMessage.innerHTML = `
            <div class="alert alert-error">
                ${escapeHTML(error.message)}
            </div>
        `;

    taskList.innerHTML = "";
  }
}

// Retrieve dashboard summary
async function loadSummary() {
  try {
    const response = await fetch("/api/tasks/summary");

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    document.getElementById("totalTasks").textContent = data.summary.total;

    document.getElementById("pendingTasks").textContent = data.summary.pending;

    document.getElementById("inProgressTasks").textContent =
      data.summary.inProgress;

    document.getElementById("completedTasks").textContent =
      data.summary.completed;
  } catch (error) {
    console.error("Unable to load dashboard summary:", error);
  }
}

// Search button
searchButton.addEventListener("click", loadTasks);

// Search using Enter key
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    loadTasks();
  }
});

// Filter when status changes
statusFilter.addEventListener("change", loadTasks);

// Reset search and filter
resetButton.addEventListener("click", () => {
  searchInput.value = "";
  statusFilter.value = "";

  loadTasks();
});

// Load dashboard when page opens
loadTasks();
loadSummary();
