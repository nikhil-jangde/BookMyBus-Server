const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRoutes = require('./Api.js');
const payRoutes = require('./PaymentApi');

// Load environment variables from .env file
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Event listeners for database connection
const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('MongoDB connected successfully');
});

// Use API routes
app.use('/Api', apiRoutes);
app.use('/PaymentApi', payRoutes);

// Shows the status of the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
