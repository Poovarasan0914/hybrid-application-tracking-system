const Application = require('../models/Application');
const { createAuditLog } = require('../controllers/auditController');

class BotAutomationService {
    constructor() {
        this.isRunning = false;
        this.interval = null;
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        console.log('🤖 Bot automation started - processing technical applications every 2 minutes');
        
        this.interval = setInterval(async () => {
            await this.processApplications();
        }, 120000); // 2 minutes
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.isRunning = false;
        console.log('🤖 Bot automation stopped');
    }

    async processApplications() {
        try {
            const pendingApps = await Application.find({ status: 'pending' })
                .populate('jobId', 'title roleCategory');

            const technicalApps = pendingApps.filter(app => 
                app.jobId && app.jobId.roleCategory === 'technical'
            );

            if (technicalApps.length === 0) return;

            const outcomes = ['reviewing', 'shortlisted', 'rejected', 'accepted'];
            let processedCount = 0;

            for (const app of technicalApps) {
                const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
                
                app.status = randomOutcome;
                app.notes.push({
                    text: `🤖 Auto-processed: ${randomOutcome}`,
                    addedBy: app.applicantId // Use applicant as fallback
                });
                await app.save();
                processedCount++;
            }

            if (processedCount > 0) {
                console.log(`🤖 Auto-processed ${processedCount} technical applications`);
            }

        } catch (error) {
            console.error('Bot automation error:', error);
        }
    }
}

module.exports = new BotAutomationService();