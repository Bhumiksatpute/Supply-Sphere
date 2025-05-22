const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Store tracking details temporarily (in-memory)
let trackingDetails = {};

// Track Shipment (POST route)
app.post('/track', (req, res) => {
    const { containerNo, airwayBill, billEntry, email, contact } = req.body;

    // Simulate storing data
    trackingDetails = {
        containerNo,
        airwayBill,
        billEntry,
        email,
        contact,
        status: 'In Transit', // Example tracking status
    };

    // Send back a response
    res.json({
        status: 'success',
        message: 'Tracking details saved successfully.',
        trackingDetails: trackingDetails,
    });
});

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
