const { Task } = require('../models/Task');
const fs = require('fs').promises;
const path = require('path');
const TASKS_FILE = path.join('utils', 'tasks.json');
const TEMPLATE_FILE = path.join('utils', 'tasks.template.json');

async function createTask(req, res) {
   try {
      // Extract task data from request body
      const { title, description, category, priority, dueDate, status, username } = req.body;
      const newTask = new Task(title, description, category, priority, dueDate, status, username);
      let tasks = [];
      // Requirements for task data: must not be empty, null and must be of correct type. If any of these requirements are not met, throw an error.
      const fields = [
         newTask.title,
         newTask.description,
         newTask.category,
         newTask.priority, 
         newTask.dueDate,
         newTask.status 
      ];

      // Validate data and throw an error if any required field is missing or invalid
      if (fields.some(field => field === null || field === undefined || field === '')) {
         throw new Error('All fields are required');
      }

      try {
         // Try reading the existing tasks.json
         const data = await fs.readFile(TASKS_FILE, 'utf8');
         tasks = JSON.parse(data);
      } catch (err) {
         if (err.code === 'ENOENT') {
            // If tasks.json doesn't exist, create it from the template
            const templateData = await fs.readFile(TEMPLATE_FILE, 'utf8');
            tasks = JSON.parse(templateData);
         } else {
            throw err;
         }
      }

      // Duplicate data check
      const duplicateTask = tasks.some(task =>
         task.title === newTask.title
      );

      // Validate data and throw an error if any duplicate task is found
      if (duplicateTask) {
         throw new Error('Task already exists');
      }
      
      // Add new task and save to file
      tasks.push(newTask);
      await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2),
      'utf8');
      return res.status(201).json(tasks);
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
   }
}

module.exports = { createTask }