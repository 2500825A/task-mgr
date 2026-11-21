class User {
    constructor(username) {
        // Generate a unique ID
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);

        this.id = timestamp + "" + random.toString().padStart(3, '0');

        // Store the username
        this.username = username;
    }
}

module.exports = { User };