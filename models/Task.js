class Task {
   constructor(title, description, category, priority, dueDate, status) {

      const timestamp = new Date().getTime();
      const random = Math.floor(Math.random() * 1000);
      this.id = timestamp + "" + random.toString().padStart(3, '0');

      this.title = title;
      this.description = description;
      this.category = category;
      this.priority = priority;
      this.dueDate = dueDate;
      this.status = status;

      this.createdAt = new Date(timestamp).toISOString();
      this.updatedAt = new Date(timestamp).toISOString();
   }
}
module.exports = { Task };