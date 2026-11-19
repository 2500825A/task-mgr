var express = require("express");
var bodyParser = require("body-parser");
var app = express();

const coenUtil = require("./utils/CoenUtil");
const readTasksUtil = require("./utils/KevinUtil");

const PORT = process.env.PORT || 5050;
var startPage = "index.html";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/" + startPage);
});

app.get("/api/tasks", async (req, res) => {
  try {
    const { status, search } = req.query;

    const validStatuses = ["Pending", "In Progress", "Completed"];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status filter.",
      });
    }

    if (search !== undefined && typeof search !== "string") {
      return res.status(400).json({
        message: "Invalid search input.",
      });
    }

    if (search && search.length > 100) {
      return res.status(400).json({
        message: "Search must not exceed 100 characters.",
      });
    }

    const tasks = await readTasksUtil.getTasks({
      status,
      search: search ? search.trim() : "",
    });

    return res.status(200).json({
      message: "Tasks retrieved successfully.",
      tasks: tasks,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to retrieve tasks.",
    });
  }
});

app.get("/api/tasks/summary", async (req, res) => {
  try {
    const summary = await readTasksUtil.getTaskSummary();

    return res.status(200).json({
      message: "Summary retrieved successfully.",
      summary: summary,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to retrieve task summary.",
    });
  }
});

app.get("/api/tasks/:id", async (req, res) => {
  try {
    const taskId = req.params.id;

    if (!/^\d+$/.test(taskId)) {
      return res.status(400).json({
        message: "Invalid task ID.",
      });
    }

    const task = await readTasksUtil.getTaskById(taskId);

    return res.status(200).json({
      message: "Task retrieved successfully.",
      task: task,
    });
  } catch (error) {
    console.error(error);

    return res.status(error.statusCode || 500).json({
      message: error.message || "Unable to retrieve task.",
    });
  }
});

app.patch("/api/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await coenUtil.updateTask(req.params.id, req.body);

    return res.status(200).json({
      message: "Task updated successfully.",
      task: updatedTask,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal server error.",
    });
  }
});

const server = app.listen(PORT, function () {
  const address = server.address();

  const baseUrl = `http://${
    address.address === "::" ? "localhost" : address.address
  }:${address.port}`;

  console.log(`Demo project at: ${baseUrl}`);
});

module.exports = {
  app,
  server,
};
