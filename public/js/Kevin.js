const taskList = document.getElementById("taskList");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

const searchButton = document.getElementById("searchButton");
const resetButton = document.getElementById("resetButton");

const errorMessage = document.getElementById("errorMessage");

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

function isOverdue(task) {
  if (task.status === "Completed" || !task.dueDate) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(task.dueDate + "T00:00:00");

  return !Number.isNaN(dueDate.getTime()) && dueDate < today;
}

function displayTasks(tasks) {
  taskList.innerHTML = "";

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

    let statusClass = getStatusClass(task.status);

    let statusText = task.status;

    if (isOverdue(task)) {
      statusClass = "status-overdue";
      statusText = "Overdue";
    }

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

                <button
                    class="btn btn-secondary view-details-btn"
                    type="button"
                    data-id="${escapeHTML(task.id)}"
                >
                    View Details
                </button>

            </div>
        `;

    taskList.appendChild(taskCard);
  });
}

async function loadTasks() {
  errorMessage.innerHTML = "";

  const search = searchInput.value.trim();
  const status = statusFilter.value;

  if (search.length > 100) {
    errorMessage.innerHTML = `
            <div class="alert alert-error">
                Search must not exceed 100 characters.
            </div>
        `;

    return;
  }

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

taskList.addEventListener("click", (event) => {
  const button = event.target.closest(".view-details-btn");

  if (!button) {
    return;
  }

  const taskId = button.dataset.id;

  window.location.href = `task-details.html?id=${encodeURIComponent(taskId)}`;
});

searchButton.addEventListener("click", loadTasks);

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    loadTasks();
  }
});

statusFilter.addEventListener("change", loadTasks);

resetButton.addEventListener("click", () => {
  searchInput.value = "";
  statusFilter.value = "";

  loadTasks();
});

loadTasks();
loadSummary();
