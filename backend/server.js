const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const config = require('./config/config');
const { limiter, authLimiter } = require('./middleware/rateLimiter');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const auditRoutes = require('./routes/auditRoutes');
const botRoutes = require('./routes/botRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const botAutomation = require('./services/botAutomation');
const botMimic = require('./services/botMimic');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(limiter); // Global rate limiting
app.use('/api/auth', authLimiter); // Stricter rate limiting for auth routes

// MongoDB Connection
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api', userRoutes);
app.use('/api', jobRoutes);
app.use('/api', applicationRoutes);
app.use('/api', auditRoutes);
app.use('/api', botRoutes);
app.use('/api', dashboardRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start the server
app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
    
    // Start bot automation services
    botAutomation.start();
    botMimic.start();
});
