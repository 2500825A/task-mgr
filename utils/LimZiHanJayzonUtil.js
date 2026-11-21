// Import the User model
const { User } = require('../models/Users');

// Import file system and path modules
const fs = require('fs').promises;
const path = require('path');

// File paths
const USERS_FILE = path.join('utils', 'users.json');
const TEMPLATE_FILE = path.join('utils', 'users.template.json');

async function readUsers() {
    let users = [];

    try {
        // Try reading the existing users.json
        const data = await fs.readFile(USERS_FILE, 'utf8');
        const parsedData = JSON.parse(data);
        if (!Array.isArray(parsedData.users)) {
            throw new Error('Invalid users file format');
        }

        users = parsedData.users;

    } catch (err) {
        if (err.code === 'ENOENT') {
            // If users.json doesn't exist, read users.template.json
            const data = await fs.readFile(TEMPLATE_FILE, 'utf8');
            const parsedData = JSON.parse(data);
            if (!Array.isArray(parsedData.users)) {
                throw new Error('Invalid users file format');
            }

            users = parsedData.users;

        } else {
            throw err;
        }
    }

    return users;
}

async function saveUsers(users) {
    // Save the updated users array into users.json
    await fs.writeFile(
        USERS_FILE,
        JSON.stringify({ users: users }, null, 2),
        'utf8'
    );
}

async function signup(req, res) {
    try {
        // A. Get the username from the request body
        const { username } = req.body;

        // B. Validate the username
        if (typeof username !== 'string' || username.trim() === '') {
            return res.status(400).json({
                message: 'Username is required'
            });
        }

        const cleanUsername = username.trim();

        // C. Read the existing users
        const users = await readUsers();

        // D. Check whether the username already exists
        const existingUser = users.find(user =>
            user.username.toLowerCase() === cleanUsername.toLowerCase()
        );

        if (existingUser) {
            return res.status(409).json({
                message: 'Username already exists'
            });
        }

        // E. Create a new User object
        const newUser = new User(cleanUsername);

        // F. Add the new user to the users array
        users.push(newUser);

        // G. Save the updated users
        await saveUsers(users);

        // H. Send a successful response
        return res.status(201).json({
            message: 'Account created successfully',
            user: newUser
        });

    } catch (error) {
        console.error('Signup error:', error);

        return res.status(500).json({
            message: 'An error occurred while creating the account'
        });
    }
}

async function login(req, res) {
    try {
        // A. Get the username from the request body
        const { username } = req.body;

        // B. Validate the username
        if (typeof username !== 'string' || username.trim() === '') {
            return res.status(400).json({
                message: 'Username is required'
            });
        }

        const cleanUsername = username.trim();

        // C. Read the existing users
        const users = await readUsers();

        // D. Check whether the username exists
        const existingUser = users.find(user =>
            user.username.toLowerCase() === cleanUsername.toLowerCase()
        );

        // E. Return the appropriate response
        if (!existingUser) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        return res.status(200).json({
            message: 'Login successful',
            user: existingUser
        });

    } catch (error) {
        console.error('Login error:', error);

        return res.status(500).json({
            message: 'An error occurred while logging in'
        });
    }
}

module.exports = {
    signup,
    login
};