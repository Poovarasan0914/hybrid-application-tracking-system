const mongoose = require('mongoose');
require('dotenv').config();

const Job = require('../models/Job');
const config = require('../config/config');

async function setupRoleCategories() {
    try {
        await mongoose.connect(config.mongoURI);
        console.log('Connected to MongoDB');

        // Update existing jobs to have proper roleCategory
        const technicalKeywords = ['developer', 'engineer', 'programmer', 'technical', 'software', 'frontend', 'backend', 'fullstack', 'devops', 'data scientist', 'ml engineer'];
        
        // Set technical roles
        await Job.updateMany(
            {
                $or: [
                    { title: { $regex: new RegExp(technicalKeywords.join('|'), 'i') } },
                    { department: { $regex: /engineering|technical|development|software|programming|IT/i } }
                ]
            },
            { $set: { roleCategory: 'technical' } }
        );

        // Set non-technical roles
        await Job.updateMany(
            {
                roleCategory: { $ne: 'technical' }
            },
            { $set: { roleCategory: 'non-technical' } }
        );

        const technicalCount = await Job.countDocuments({ roleCategory: 'technical' });
        const nonTechnicalCount = await Job.countDocuments({ roleCategory: 'non-technical' });

        console.log(`Updated ${technicalCount} technical jobs`);
        console.log(`Updated ${nonTechnicalCount} non-technical jobs`);

        await mongoose.disconnect();
        console.log('Setup complete!');
    } catch (error) {
        console.error('Setup error:', error);
        process.exit(1);
    }
}

setupRoleCategories();