const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const path = require('path');
const { log } = require('console');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('./public'));

// Routes
app.use('/api', userRoutes);

const uri = process.env.MONGO_URI;
// Connect to MongoDB
 mongoose.connect(uri, {})
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error:', err));
module.exports = app;
