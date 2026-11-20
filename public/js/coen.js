
(() => {
    const openButton = document.getElementById("openUpdateForm");
    const updateContainer = document.getElementById("updateTaskContainer");
    const updateForm = document.getElementById("updateTaskForm");
    const taskDropdown = document.getElementById("taskToEdit");
    const taskIdInput = document.getElementById("updateTaskId");
    const updateMessage = document.getElementById("updateMessage");
    const cancelButton = document.getElementById("cancelUpdate");

    const titleInput = document.getElementById("updateTitle");
    const descriptionInput = document.getElementById("updateDescription");
    const categoryInput = document.getElementById("updateCategory");
    const priorityInput = document.getElementById("updatePriority");
    const dueDateInput = document.getElementById("updateDueDate");
    const statusInput = document.getElementById("updateStatus");

    // Display a message to the user
    function showMessage(message, type) {
        updateMessage.innerHTML = "";

        const alert = document.createElement("div");
        alert.className = `alert alert-${type}`;
        alert.textContent = message;

        updateMessage.appendChild(alert);
    }

    // Retrieve all tasks and populate the dropdown
    async function loadTaskOptions() {
        try {
            const response = await fetch("/api/tasks");
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to load tasks.");
            }

            taskDropdown.innerHTML = '<option value="">Select a task</option>';

            data.tasks.forEach(task => {
                const option = document.createElement("option");

                option.value = task.id;
                option.textContent = `${task.title} (ID: ${task.id})`;

                taskDropdown.appendChild(option);
            });

        } catch (error) {
            showMessage(error.message, "error");
        }
    }

    // Clear the form
    function clearForm() {
        updateForm.reset();
        taskIdInput.value = "";
        taskDropdown.value = "";
        updateMessage.innerHTML = "";
    }

    // Open the update form
    openButton.addEventListener("click", async () => {
        updateContainer.style.display = "block";
        clearForm();
        await loadTaskOptions();
    });

    // Retrieve the selected task's details
    taskDropdown.addEventListener("change", async () => {
        const taskId = taskDropdown.value;

        if (!taskId) {
            clearForm();
            return;
        }

        try {
            const response = await fetch(`/api/tasks/${encodeURIComponent(taskId)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to retrieve task.");
            }

            const task = data.task;

            taskIdInput.value = task.id;
            titleInput.value = task.title;
            descriptionInput.value = task.description;
            categoryInput.value = task.category;
            priorityInput.value = task.priority;
            dueDateInput.value = task.dueDate;
            statusInput.value = task.status;

            updateMessage.innerHTML = "";

        } catch (error) {
            showMessage(error.message, "error");
        }
    });

    // Save the updated task
    updateForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const taskId = taskIdInput.value;

        if (!taskId) {
            showMessage("Please select a task first.", "error");
            return;
        }

        const updatedTask = {
            title: titleInput.value.trim(),
            description: descriptionInput.value.trim(),
            category: categoryInput.value,
            priority: priorityInput.value,
            dueDate: dueDateInput.value,
            status: statusInput.value
        };

        try {
            const response = await fetch(`/api/tasks/${encodeURIComponent(taskId)}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedTask)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to update task.");
            }

            showMessage("Task updated successfully!", "success");

            if (typeof loadTasks === "function") {
                await loadTasks();
            }
            if (typeof loadSummary === "function") {
                await loadSummary();
            }
            await loadTaskOptions();
            taskDropdown.value = taskId;

        } catch (error) {
            showMessage(error.message, "error");
        }
    });

    // Close the update form
    cancelButton.addEventListener("click", () => {
        updateContainer.style.display = "none";
        clearForm();
    });

})();
