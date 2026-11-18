
const fs = require('fs').promises;
const path = require('path');

const tasksFilePath = path.join(__dirname, 'tasks.json');

const validCategories = ['Assignment', 'Revision', 'Project', 'Others'];
const validPriorities = ['Low', 'Medium', 'High'];
const validStatuses = ['Pending', 'In Progress', 'Completed'];

async function updateTask(taskId, updatedData) {
    const id = Number(taskId);

    if (!Number.isInteger(id) || id <= 0) {
        const error = new Error('Invalid task ID.');
        error.statusCode = 400;
        throw error;
    }

    if (
        !updatedData ||
        typeof updatedData !== 'object' ||
        Array.isArray(updatedData)
    ) {
        const error = new Error('Invalid task details.');
        error.statusCode = 400;
        throw error;
    }

    const allowedFields = [
        'title',
        'description',
        'category',
        'priority',
        'dueDate',
        'status'
    ];

    const fields = Object.keys(updatedData);

    if (
        fields.length === 0 ||
        fields.some(field => !allowedFields.includes(field))
    ) {
        const error = new Error('Invalid or missing task fields.');
        error.statusCode = 400;
        throw error;
    }

    for (const field of fields) {
        if (
            typeof updatedData[field] !== 'string' ||
            updatedData[field].trim() === ''
        ) {
            const error = new Error(`${field} is required and must be valid.`);
            error.statusCode = 400;
            throw error;
        }
    }

    if (
        updatedData.title !== undefined &&
        updatedData.title.trim().length > 100
    ) {
        const error = new Error('Task title must not exceed 100 characters.');
        error.statusCode = 400;
        throw error;
    }

    if (
        updatedData.description !== undefined &&
        updatedData.description.trim().length > 500
    ) {
        const error = new Error('Description must not exceed 500 characters.');
        error.statusCode = 400;
        throw error;
    }

    if (
        updatedData.category !== undefined &&
        !validCategories.includes(updatedData.category)
    ) {
        const error = new Error('Invalid task category.');
        error.statusCode = 400;
        throw error;
    }

    if (
        updatedData.priority !== undefined &&
        !validPriorities.includes(updatedData.priority)
    ) {
        const error = new Error('Invalid task priority.');
        error.statusCode = 400;
        throw error;
    }

    if (
        updatedData.status !== undefined &&
        !validStatuses.includes(updatedData.status)
    ) {
        const error = new Error('Invalid task status.');
        error.statusCode = 400;
        throw error;
    }

    if (updatedData.dueDate !== undefined) {
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        const date = new Date(`${updatedData.dueDate}T00:00:00.000Z`);

        if (
            !datePattern.test(updatedData.dueDate) ||
            isNaN(date.getTime()) ||
            date.toISOString().slice(0, 10) !== updatedData.dueDate
        ) {
            const error = new Error('Invalid due date. Use YYYY-MM-DD.');
            error.statusCode = 400;
            throw error;
        }
    }

    const fileContent = await fs.readFile(tasksFilePath, 'utf8');
    const tasks = JSON.parse(fileContent);

    if (!Array.isArray(tasks)) {
        throw new Error('Invalid task data storage.');
    }

    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
        const error = new Error('Task not found.');
        error.statusCode = 404;
        throw error;
    }

    tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...Object.fromEntries(
            fields.map(field => [field, updatedData[field].trim()])
        ),
        updatedAt: new Date().toISOString()
    };

    await fs.writeFile(
        tasksFilePath,
        JSON.stringify(tasks, null, 4),
        'utf8'
    );

    return tasks[taskIndex];
}

module.exports = {
    updateTask
};
