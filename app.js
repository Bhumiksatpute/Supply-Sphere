const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');


const app = express();
const port = 4000;


// Use body-parser to parse form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files (CSS, JS) directly
app.use(express.static(path.join(__dirname)));

// Read the user data from data.json
const readData = () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Write the user data to data.json
const writeData = (data) => {
  fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(data, null, 2));
};

// Serve the login.html file
app.get('/', (req, res) => {
    res.send('Welcome to LogiChain!');
});


// Signup Route
app.post('/signup', (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match!');
  }

  // Check if the user already exists
  const users = readData();
  const userExists = users.find((user) => user.email === email);

  if (userExists) {
    return res.status(400).send('User already exists!');
  }

  // Create a new user
  const newUser = { name, email, password };
  users.push(newUser);
  writeData(users);

  return res.send('User created successfully! You can now log in.');
});

// Login Route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  app.post('/login', (req, res) => {
    // Validate input and register user
    res.json({ message: 'User registered successfully!' });
  });
  

  const users = readData();
  const user = users.find((user) => user.email === email && user.password === password);

  if (!user) {
    return res.status(400).send('Invalid email or password.');
  }

  res.sendFile(path.join(__dirname, 'eg.html'));  // Redirect to a welcome page
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
