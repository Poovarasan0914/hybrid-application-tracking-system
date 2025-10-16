// Core dependencies for Express server
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config(); // Load environment variables

// Application configuration and middleware
const config = require('./config/config');
const { limiter, authLimiter } = require('./middleware/rateLimiter');

// Route handlers for different modules
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const auditRoutes = require('./routes/auditRoutes');
const botRoutes = require('./routes/botRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Bot automation services for technical role processing
const botAutomation = require('./services/botAutomation');
const botMimic = require('./services/botMimic');

// Initialize Express application
const app = express();

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Application Tracking System API',
            version: '1.0.0',
            description: 'MERN stack application for managing job applications with automated tracking',
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(swaggerOptions);

// Middleware configuration
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies
app.use(limiter); // Apply global rate limiting to prevent abuse
app.use('/api/auth', authLimiter); // Apply stricter rate limiting for authentication routes

// MongoDB Connection
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// API Routes - All routes are prefixed with /api
app.use('/api', userRoutes);        // User authentication and profile management
app.use('/api', jobRoutes);         // Job listings and management
app.use('/api', applicationRoutes); // Application submission and tracking
app.use('/api', auditRoutes);       // Audit logs and system monitoring
app.use('/api', botRoutes);         // Bot automation and mimic services
app.use('/api', adminRoutes);       // Admin management functions
app.use('/api', dashboardRoutes);   // Dashboard data and analytics

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

// Start the Express server
app.listen(config.port, () => {
    console.log(`🚀 Server is running on port ${config.port}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📚 API Documentation: http://localhost:${config.port}/api-docs`);
    
    // Initialize bot automation services for technical role processing
    console.log('🤖 Starting bot automation services...');
    botAutomation.start();  // Basic bot automation
    botMimic.start();       // Human-like workflow mimic service
    console.log('✅ All services initialized successfully');
});
