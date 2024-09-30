const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log('MongoDB connection error:', err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB Atlas');
});

// Nieuwe route voor database-connectietest
app.get('/api/test-db-connection', async (req, res) => {
  try {
    // Probeer een eenvoudige operatie uit te voeren
    await mongoose.connection.db.admin().ping();
    res.json({ message: "Database connection successful!" });
  } catch (error) {
    console.error("Database connection test failed:", error);
    res.status(500).json({ message: "Database connection failed", error: error.message });
  }
});

// Routes
const tradeRoutes = require('./routes/trades');
app.use('/api/trades', tradeRoutes);

// Basic route (you can keep this for testing)
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the Trading Journal API" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));