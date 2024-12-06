// const express = require('express'); // Import Express
// const bodyParser = require('body-parser'); // Middleware for parsing JSON
// const cors = require('cors'); // Middleware for Cross-Origin Requests

// const app = express(); // Create an instance of Express
// const PORT = 3000; // Port number

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // Sample Route to Test
// app.get('/', (req, res) => {
//     res.send('Server is running!');
// });

// // Start the Server
// try {
//     app.listen(PORT, () => {
//         console.log(`Server is running on http://localhost:${PORT}`);
//     });
//     console.log('app.listen() was called successfully.');
// } catch (error) {
//     console.error('Error starting the server:', error);
// }






const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// Initialize express app
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files (e.g., uploaded images)

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Adds timestamp to filename
    },
});
const upload = multer({ storage: storage });

// Store registrations (in memory or a database)
let registrations = [];

// Register route
app.post('/register', upload.single('image'), (req, res) => {
    const { name, email, date, event } = req.body;
    const image = req.file ? req.file.filename : null; // Store the image filename if uploaded

    // Save the registration
    registrations.push({ name, email, date, event, image });

    // Respond back with success
    res.send('Registration successful');
});

// View registrations for a specific event
app.get('/registrations', (req, res) => {
    const event = req.query.event;
    const filteredRegistrations = registrations.filter(r => r.event === event);
    res.json(filteredRegistrations);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
