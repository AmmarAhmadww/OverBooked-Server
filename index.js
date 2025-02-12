const express = require('express');
const ejs = require('ejs');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();


// Update CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Add this to allow credentials
}));

// Add preflight handling
app.options('*', cors());

// Set EJS as the view engine (for existing EJS routes, if any)
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' folder
app.use(express.static("public"));

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// React build folder path
const reactBuildPath = path.join(__dirname, 'frontend', 'build');

// Serve React static files
app.use(express.static(reactBuildPath));

// Existing backend routes
app.use("/", require(path.join(__dirname, "./routes/routes.js")));

// EJS home route (can be replaced with React's equivalent later)
app.get('/home', (req, res) => {
    res.render('home');
});

// Fallback route for React
app.get('*', (req, res) => {
    res.sendFile(path.join(reactBuildPath, 'index.html'));
});

// MongoDB Connection with better error handling and options
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
})
.then(() => {
  console.log('Connected to MongoDB successfully');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit with failure
});

// Handle connection errors after initial connection
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

// Close MongoDB connection when Node process ends
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
