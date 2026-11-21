const fs = require('fs').promises;
const path = require('path');

// Get the location of tasks.json
const tasksFilePath = path.join(__dirname, 'tasks.json');

async function deleteTask(taskId) {
    // 1. Validate the task ID
    if (!/^\d+$/.test(String(taskId))) {
        const error = new Error('Invalid task ID.');
        error.statusCode = 400;
        throw error;
    }

    // 2. Read the existing tasks
    const fileContent = await fs.readFile(tasksFilePath, 'utf8');
    const tasks = JSON.parse(fileContent);

    if (!Array.isArray(tasks)) {
        throw new Error('Invalid task data storage.');
    }

    // 3. Find the task using its ID
    // Convert both IDs to strings to ensure they match
    const taskIndex = tasks.findIndex(
        task => String(task.id) === String(taskId)
    );

    // 4. Check whether the task exists
    if (taskIndex === -1) {
        const error = new Error('Task not found.');
        error.statusCode = 404;
        throw error;
    }

    // 5. Remove the task from the array
    const deletedTask = tasks.splice(taskIndex, 1)[0];

    // 6. Save the updated task list
    await fs.writeFile(
        tasksFilePath,
        JSON.stringify(tasks, null, 4),
        'utf8'
    );

    return deletedTask;
}

module.exports = { deleteTask };