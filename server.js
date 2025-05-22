const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// === USER SIGNUP ===
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const usersPath = path.join(__dirname, 'users.json');
    let users = [];
    if (fs.existsSync(usersPath)) {
        users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    }

    // Check if user already exists
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'Email already registered.' });
    }

    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password // In production, hash the password!
    };
    users.push(newUser);
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
    res.status(201).json({ message: 'Signup successful!' });
});

// === USER LOGIN ===
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const usersPath = path.join(__dirname, 'users.json');
    let users = [];
    if (fs.existsSync(usersPath)) {
        users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    }

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }

    res.json({ user: { id: user.id, name: user.name, email: user.email } });
});

// === FETCH USER INFO ===
app.get('/user/:id', (req, res) => {
    const usersPath = path.join(__dirname, 'users.json');
    let users = [];
    if (fs.existsSync(usersPath)) {
        users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    }
    const user = users.find(u => u.id === req.params.id);
    if (user) {
        res.json({ name: user.name, email: user.email });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// === GET ALL CHAT MESSAGES ===
app.get('/messages', (req, res) => {
    const messagesPath = path.join(__dirname, 'messages.json');
    let messages = [];
    if (fs.existsSync(messagesPath)) {
        messages = JSON.parse(fs.readFileSync(messagesPath, 'utf8'));
    }
    res.json(messages);
});

// === POST A NEW CHAT MESSAGE ===
app.post('/messages', (req, res) => {
    const { userId, text } = req.body;
    if (!userId || !text) {
        return res.status(400).json({ message: 'User ID and message text are required.' });
    }

    // Get user name
    const usersPath = path.join(__dirname, 'users.json');
    let users = [];
    if (fs.existsSync(usersPath)) {
        users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    }
    const user = users.find(u => u.id === userId);
    const username = user ? user.name : 'Unknown';

    // Save message
    const messagesPath = path.join(__dirname, 'messages.json');
    let messages = [];
    if (fs.existsSync(messagesPath)) {
        messages = JSON.parse(fs.readFileSync(messagesPath, 'utf8'));
    }
    const newMessage = {
        username,
        text,
        timestamp: new Date().toISOString()
    };
    messages.push(newMessage);
    fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2));

    res.status(201).json({ message: 'Message sent' });
});

// (Optional) Your existing /submit endpoint can be removed if not needed, as /messages handles chat now

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
