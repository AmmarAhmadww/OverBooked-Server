const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const server = require("./index.js");
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const app = express();

// Configure body-parser before any routes
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Create upload directories if they don't exist
const uploadDirs = ['uploads', 'uploads/pdfs', 'uploads/covers'];
uploadDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

server.listen(PORT, function(){
    console.log('listening on port: ' + PORT);
});
//weeeeeeeeeeeeewooooooooos
//weeewooo2