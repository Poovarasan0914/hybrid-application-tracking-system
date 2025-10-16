const Application = require('../models/Application');
const { createAuditLog } = require('../controllers/auditController');

/**
 * BotMimicService - Simulates human-like application processing for technical roles
 * 
 * This service provides automated workflow progression that mimics human decision-making
 * patterns, including realistic delays, stage-appropriate comments, and intelligent
 * progression logic for technical role applications.
 */
class BotMimicService {
    constructor() {
        // Service state management
        this.isRunning = false;  // Track if service is actively processing
        this.interval = null;    // Store interval reference for cleanup
        
        // Workflow stage definitions for technical applications
        this.workflowStages = ['applied', 'reviewed', 'interview', 'offer'];
        this.finalStages = ['accepted', 'rejected'];
        
        // Human-like comments for each stage
        this.stageComments = {
            'applied': [
                'Application received and initial screening completed',
                'Resume reviewed - meets basic requirements',
                'Application forwarded to technical team'
            ],
            'reviewed': [
                'Technical skills assessment completed',
                'Code review passed initial evaluation',
                'Experience matches job requirements',
                'Moving to interview stage'
            ],
            'interview': [
                'Technical interview scheduled',
                'Interview completed - positive feedback',
                'Candidate demonstrated strong problem-solving skills',
                'Reference checks in progress'
            ],
            'offer': [
                'Offer package being prepared',
                'Salary negotiation in progress',
                'Final approval from management',
                'Offer letter ready for dispatch'
            ],
            'accepted': [
                'Candidate accepted the offer',
                'Welcome package sent',
                'Onboarding process initiated'
            ],
            'rejected': [
                'Position filled by another candidate',
                'Skills not aligned with current requirements',
                'Thank you for your interest'
            ]
        };
    }

    /**
     * Start the Bot Mimic service with scheduled processing
     * Processes technical applications every 3 minutes with human-like behavior
     */
    start() {
        // Prevent multiple instances from running
        if (this.isRunning) return;
        
        this.isRunning = true;
        console.log('🤖 Bot Mimic started - Human-like workflow processing every 3 minutes');
        
        // Initial processing after 5 seconds to allow system initialization
        setTimeout(() => this.processWorkflow(), 5000);
        
        // Schedule recurring processing every 3 minutes (180000ms)
        // This interval simulates regular human check-ins on applications
        this.interval = setInterval(async () => {
            await this.processWorkflow();
        }, 180000);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.isRunning = false;
        console.log('🤖 Bot Mimic stopped');
    }

    async processWorkflow() {
        try {
            // Get all technical applications that can be progressed
            const applications = await Application.find({
                status: { $in: [...this.workflowStages, 'pending'] }
            }).populate('jobId', 'title roleCategory');

            const technicalApps = applications.filter(app => 
                app.jobId && app.jobId.roleCategory === 'technical'
            );

            if (technicalApps.length === 0) return;

            let processedCount = 0;

            for (const app of technicalApps) {
                // Simulate human-like processing delays and decisions
                if (Math.random() < 0.3) continue; // 30% chance to skip (human-like)

                const currentStage = app.status === 'pending' ? 'applied' : app.status;
                const nextStage = this.getNextStage(currentStage);

                if (nextStage) {
                    await this.progressApplication(app, currentStage, nextStage);
                    processedCount++;
                }
            }

            if (processedCount > 0) {
                console.log(`🤖 Bot Mimic processed ${processedCount} technical applications`);
            }

        } catch (error) {
            console.error('Bot Mimic error:', error);
        }
    }

    getNextStage(currentStage) {
        if (currentStage === 'pending') return 'applied';
        
        const currentIndex = this.workflowStages.indexOf(currentStage);
        
        if (currentIndex === -1) return null; // Already in final stage
        
        // 80% chance to progress, 20% chance to reject
        if (Math.random() < 0.2) {
            return 'rejected';
        }
        
        // Progress to next stage or final acceptance
        if (currentIndex < this.workflowStages.length - 1) {
            return this.workflowStages[currentIndex + 1];
        } else {
            return 'accepted'; // Final stage
        }
    }

    async progressApplication(app, fromStage, toStage) {
        try {
            const oldStatus = app.status;
            app.status = toStage;
            app.workflowStage = toStage;
            
            // Add human-like note
            const comments = this.stageComments[toStage] || ['Status updated'];
            const randomComment = comments[Math.floor(Math.random() * comments.length)];
            
            app.notes.push({
                text: `🎯 Bot Mimic: ${randomComment}`,
                addedBy: app.applicantId, // Use applicant as fallback
                addedAt: new Date(),
                processedBy: 'bot-mimic',
                actionType: 'workflow_progression'
            });

            await app.save();

            // Create detailed audit log
            await createAuditLog({
                userId: app.applicantId,
                action: 'BOT_MIMIC_WORKFLOW',
                resourceType: 'application',
                resourceId: app._id,
                description: `Bot Mimic progressed application: ${fromStage} → ${toStage}`,
                details: {
                    oldStage: fromStage,
                    newStage: toStage,
                    processedBy: 'bot-mimic',
                    roleCategory: 'technical',
                    timestamp: new Date(),
                    comment: randomComment,
                    jobTitle: app.jobId.title
                }
            });

            console.log(`🎯 Bot Mimic: ${app.jobId.title} - ${fromStage} → ${toStage}`);

        } catch (error) {
            console.error('Error progressing application:', error);
        }
    }

    // Manual trigger for on-demand processing
    async triggerWorkflow() {
        console.log('🎯 Bot Mimic: Manual workflow trigger initiated');
        await this.processWorkflow();
        return { message: 'Workflow processing completed' };
    }

    // Get workflow statistics
    async getWorkflowStats() {
        try {
            const applications = await Application.find({})
                .populate('jobId', 'roleCategory');

            const technicalApps = applications.filter(app => 
                app.jobId && app.jobId.roleCategory === 'technical'
            );

            const stats = technicalApps.reduce((acc, app) => {
                const stage = app.workflowStage || app.status;
                acc[stage] = (acc[stage] || 0) + 1;
                return acc;
            }, {});

            return {
                totalTechnicalApplications: technicalApps.length,
                stageDistribution: stats,
                isRunning: this.isRunning
            };
        } catch (error) {
            console.error('Error getting workflow stats:', error);
            return { error: 'Failed to get stats' };
        }
    }
}

module.exports = new BotMimicService();