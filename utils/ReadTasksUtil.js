const fs = require("fs").promises;
const path = require("path");

const TASKS_FILE = path.join(__dirname, "tasks.json");

async function readTasks() {
  const data = await fs.readFile(TASKS_FILE, "utf8");

  return JSON.parse(data);
}

async function getTasks(filters = {}) {
  let tasks = await readTasks();

  if (filters.status) {
    tasks = tasks.filter((task) => task.status === filters.status);
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();

    tasks = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm),
    );
  }

  return tasks;
}

async function getTaskSummary() {
  const tasks = await readTasks();

  return {
    total: tasks.length,
    pending: tasks.filter((task) => task.status === "Pending").length,
    inProgress: tasks.filter((task) => task.status === "In Progress").length,
    completed: tasks.filter((task) => task.status === "Completed").length,
  };
}

module.exports = {
  readTasks,
  getTasks,
  getTaskSummary,
};
