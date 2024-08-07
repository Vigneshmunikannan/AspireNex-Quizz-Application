const asynchandler = require('express-async-handler');
const User = require('../datamodels/UserModel')
const jwt = require('jsonwebtoken')
const { addToBlacklist } = require('../tokenBlacklist')
const bcrypt = require('bcrypt')

const register = asynchandler(async (req, res) => {
    const { username, name, password, email } = req.body;

    // Check if all required fields are provided
    if (!username || !password || !name || !email) {
        res.status(400);
        throw new Error('All fields are mandatory');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400);
        throw new Error('Invalid email format');
    }
    const isValidUsername = (username) => {
        // Check if username contains only alphabets and numbers
        return /^[a-zA-Z0-9]+$/.test(username);
    };
    const isValidName = (name) => {
        // Check if username contains only letters
        return /^[a-zA-Z]+$/.test(name);
    };
    if (!isValidUsername(username)) {
        res.status(400);
        throw new Error('Invalid Username');
    }
    if (!isValidName(name)) {
        res.status(400);
        throw new Error('Invalid Name');
    }
    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        res.status(409);
        throw new Error('Username already taken');
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        res.status(409);
        throw new Error('Email already registered');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user record in the database
    const user = new User({ username, name, email, password: hashedPassword });
    await user.save();
    // Respond with success message
    res.status(200).json({
        id: user.id,
        msg: 'Registration success',
    });
})


const login = asynchandler(async (req, res) => {
    const { username, password } = req.body;
    // Check if username and password are provided
    if (!username || !password) {
        res.status(400);
        throw new Error('All fields are mandatory');
    }
    // Find the user by username
    const user = await User.findOne( { username });
    // Check if user exists and password is correct
    if (user && (await bcrypt.compare(password, user.password))) {
        // Generate JWT token
        const accessToken = jwt.sign(
            {
                user: {
                    username: user.username,
                    id: user.id // Optionally include other user details in the token
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30m' }
        );

        // Respond with token and success message
        res.status(200).json({
            token: accessToken,
            username: user.name,
            msg: 'Login successful'
        });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
})

const logout = asynchandler(async (req, res) => {
    const token = req.header('Authorization').split(' ')[1];
    // Add the token to the blacklist
    addToBlacklist(token)
    // Respond with success message
    res.status(200).json({ message: 'Logged out successfully' });
})




module.exports = {
    register,
    login,
    logout
};
