var express = require('express');
var bodyParser = require("body-parser");
var app = express();
const coenUtil = require('./utils/CoenUtil');
const PORT = process.env.PORT || 5050
var startPage = "index.html";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));
app.get('/', (req, res) => {
res.sendFile(__dirname + "/public/" + startPage);
})

app.patch('/api/tasks/:id', async (req, res) => {
    try {
        const updatedTask = await coenUtil.updateTask(
            req.params.id,
            req.body
        );

        res.status(200).json({
            message: 'Task updated successfully.',
            task: updatedTask
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message || 'Internal server error.'
        });
    }
});

server = app.listen(PORT, function () {
const address = server.address();
const baseUrl = `http://${address.address == "::" ? 'localhost' :
address.address}:${address.port}`;
console.log(`Demo project at: ${baseUrl}`);
});
module.exports = {app, server}