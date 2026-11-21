const taskDetails = document.getElementById("taskDetails");
const errorMessage = document.getElementById("errorMessage");
const editTaskContainer = document.getElementById("editTaskContainer");
const editTaskForm = document.getElementById("editTaskForm");
const editMessage = document.getElementById("editMessage");

const urlParams = new URLSearchParams(window.location.search);

const taskId = urlParams.get("id");

let currentTask = null;

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

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleString("en-SG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getStatusClass(status) {
  switch (status) {
    case "Pending":
      return "status-pending";

    case "In Progress":
      return "status-in-progress";

    case "Completed":
      return "status-completed";

    default:
      return "";
  }
}

async function loadTaskDetails() {
  if (!taskId || !/^\d+$/.test(taskId)) {
    showError("Invalid task ID.");

    return;
  }

  try {
    const response = await fetch(`/api/tasks/${encodeURIComponent(taskId)}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to retrieve task.");
    }

    const task = data.task;

    currentTask = task;

    document.getElementById("taskTitle").textContent = task.title;

    document.getElementById("taskDescription").textContent = task.description;

    document.getElementById("taskCategory").textContent = task.category;

    document.getElementById("taskPriority").textContent = task.priority;

    document.getElementById("taskDueDate").textContent = formatDate(
      task.dueDate,
    );

    document.getElementById("taskId").textContent = task.id;

    document.getElementById("taskCreatedAt").textContent = formatDate(
      task.createdAt,
    );

    document.getElementById("taskUpdatedAt").textContent = formatDate(
      task.updatedAt,
    );

    const statusElement = document.getElementById("taskStatus");

    statusElement.textContent = task.status;

    statusElement.className = "status " + getStatusClass(task.status);

    taskDetails.hidden = false;
  } catch (error) {
    showError(error.message);
  }
}

function showError(message) {
  errorMessage.innerHTML = "";

  const alert = document.createElement("div");

  alert.className = "alert alert-error";

  alert.textContent = message;

  errorMessage.appendChild(alert);
}

// Display a message inside the editing form
function showEditMessage(message, type) {
  editMessage.innerHTML = "";

  const alert = document.createElement("div");

  alert.className = `alert alert-${type}`;

  alert.textContent = message;

  editMessage.appendChild(alert);
}

// Open the editing form and fill in the existing task details
document.getElementById("editButton").addEventListener("click", function () {
  if (!currentTask) {
    return;
  }

  document.getElementById("editTitle").value = currentTask.title;
  document.getElementById("editDescription").value = currentTask.description;
  document.getElementById("editCategory").value = currentTask.category;
  document.getElementById("editPriority").value = currentTask.priority;
  document.getElementById("editDueDate").value = currentTask.dueDate;
  document.getElementById("editStatus").value = currentTask.status;

  editMessage.innerHTML = "";

  editTaskContainer.hidden = false;
});

// Cancel editing and hide the form
document.getElementById("cancelEditButton").addEventListener("click", function () {
  editTaskContainer.hidden = true;

  editTaskForm.reset();

  editMessage.innerHTML = "";
});

// Save the updated task
editTaskForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const updatedTask = {
    title: document.getElementById("editTitle").value.trim(),
    description: document.getElementById("editDescription").value.trim(),
    category: document.getElementById("editCategory").value,
    priority: document.getElementById("editPriority").value,
    dueDate: document.getElementById("editDueDate").value,
    status: document.getElementById("editStatus").value,
  };

  try {
    const response = await fetch(`/api/tasks/${encodeURIComponent(taskId)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to update task.");
    }

    // Refresh the task details after a successful update
    editTaskContainer.hidden = true;

    await loadTaskDetails();

    alert("Task updated successfully!");

  } catch (error) {
    showEditMessage(error.message, "error");
  }
});

// Delete the selected task
document.getElementById("deleteButton").addEventListener("click", async function () {
  const confirmed = window.confirm("Are you sure you want to delete this task?");

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`/api/tasks/${encodeURIComponent(taskId)}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to delete task.");
    }

    // Return to the dashboard after successful deletion
    window.location.href = "/index.html";

  } catch (error) {
    showError(error.message);
  }
});

loadTaskDetails();