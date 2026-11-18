var express = require("express");
var bodyParser = require("body-parser");
var app = express();
const coenUtil = require("./utils/CoenUtil");
const PORT = process.env.PORT || 5050;
var startPage = "index.html";
const readTasksUtil = require("./utils/ReadTasksUtil");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/" + startPage);
});

app.patch("/api/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await coenUtil.updateTask(req.params.id, req.body);

    res.status(200).json({
      message: "Task updated successfully.",
      task: updatedTask,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Internal server error.",
    });
  }
});

// GET all tasks with optional search and status filtering
app.get("/api/tasks", async (req, res) => {
  try {
    const { status, search } = req.query;

    const validStatuses = ["Pending", "In Progress", "Completed"];

    // Validate status
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status filter.",
      });
    }

    // Validate search
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

    res.status(200).json({
      message: "Tasks retrieved successfully.",
      tasks: tasks,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to retrieve tasks.",
    });
  }
});

// GET dashboard task statistics
app.get("/api/tasks/summary", async (req, res) => {
  try {
    const summary = await readTasksUtil.getTaskSummary();

    res.status(200).json({
      message: "Summary retrieved successfully.",
      summary: summary,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to retrieve task summary.",
    });
  }
});

server = app.listen(PORT, function () {
  const address = server.address();
  const baseUrl = `http://${
    address.address == "::" ? "localhost" : address.address
  }:${address.port}`;
  console.log(`Demo project at: ${baseUrl}`);
});
module.exports = { app, server };
