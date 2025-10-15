module.exports = {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/ats',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpire: '24h',
    port: process.env.PORT || 5000
};