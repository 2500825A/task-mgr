const deleteTaskList = document.getElementById("taskList");

// Add a Delete button to each task card
function addDeleteButtons() {
    const taskCards = deleteTaskList.querySelectorAll(".task-card");

    taskCards.forEach((taskCard) => {
        const taskRight = taskCard.querySelector(".task-right");

        // Avoid adding duplicate Delete buttons
        if (!taskRight || taskRight.querySelector(".delete-task-btn")) {
            return;
        }

        // Get the task ID from the existing View Details button
        const viewButton = taskRight.querySelector(".view-details-btn");

        if (!viewButton) {
            return;
        }

        const taskId = viewButton.dataset.id;

        // Create the Delete button
        const deleteButton = document.createElement("button");

        deleteButton.className = "btn btn-secondary delete-task-btn";
        deleteButton.type = "button";
        deleteButton.dataset.id = taskId;
        deleteButton.textContent = "Delete";

        // Add the button to the task card
        taskRight.appendChild(deleteButton);
    });
}

// Watch for new task cards being displayed
const taskObserver = new MutationObserver(() => {
    addDeleteButtons();
});

taskObserver.observe(deleteTaskList, {
    childList: true,
    subtree: true
});

// Handle Delete button clicks
deleteTaskList.addEventListener("click", async function (event) {

    const button = event.target.closest(".delete-task-btn");

    // Stop if another button was clicked
    if (!button) {
        return;
    }

    const taskId = button.dataset.id;

    // Ask for confirmation before deleting
    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
        return;
    }

    try {
        // Send DELETE request to the backend
        const response = await fetch(
            `/api/tasks/${encodeURIComponent(taskId)}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to delete task.");
        }

        alert("Task deleted successfully!");

        // Refresh the task list and dashboard summary
        await loadTasks();
        await loadSummary();

    } catch (error) {
        console.error("Delete task error:", error);

        alert(error.message || "Unable to delete task.");
    }
});