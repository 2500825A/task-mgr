const taskDetails = document.getElementById("taskDetails");
const errorMessage = document.getElementById("errorMessage");

const urlParams = new URLSearchParams(window.location.search);

const taskId = urlParams.get("id");

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
      throw new Error(data.message);
    }

    const task = data.task;

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

loadTaskDetails();
