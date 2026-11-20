function createTask() {
   var response = "";

   // Create an object to hold form data
   var jsonData = new Object();
   jsonData.title = document.getElementById("title").value;
   jsonData.description = document.getElementById("description").value;
   jsonData.category = document.getElementById("category").value;
   jsonData.priority = document.getElementById("priority").value;
   jsonData.dueDate = document.getElementById("dueDate").value;
   jsonData.status = document.getElementById("status").value;

   // Validate required fields (all must be filled in)
   if (jsonData.title.trim() == "" || jsonData.description.trim() == "" || jsonData.category.trim() == "" || jsonData.priority.trim() == "" || jsonData.dueDate.trim() == "" || jsonData.status.trim() == "")
   {
      alert('All fields are required!');
      return; // Stop execution if validation fails
   }

   // Configure the request to POST data to /create-task
   var request = new XMLHttpRequest();
   request.open("POST", "/create-task", true);
   request.setRequestHeader('Content-Type', 'application/json');

   // Define what happens when the server responds
   request.onload = function () {
   response = JSON.parse(request.responseText); // Parse JSON response
   console.log(response)

   // If no error message is returned → success
   if (response.message == undefined) {
      alert('Created Task: ' + jsonData.title + '!');
      // Clear form fields after success
      document.getElementById("title").value = "";
      document.getElementById("description").value = "";
      document.getElementById("category").value = "";
      document.getElementById("priority").value = "";
      document.getElementById("dueDate").value = "";
      document.getElementById("status").value = "";
      // Reload table content
      loadTasks();
   } else {
      // Show error if resource could not be added
      alert(response.message || 'Unable to create task!');
   }
   };
   // Send the request with JSON-formatted data
   request.send(JSON.stringify(jsonData));
}

function openCreateForm() {
   // Show the create task form
   document.getElementById("createTaskContainer").style.display = "block";
   // Hide the update task form
   document.getElementById("updateTaskContainer").style.display = "none";
}

function closeCreateForm() {
   // Hide the create task form
   document.getElementById("createTaskContainer").style.display = "none";
}

// Add event listener to the create task form submission
document.getElementById("createTaskForm").addEventListener("submit", function(event) {
   event.preventDefault();
   createTask();
});