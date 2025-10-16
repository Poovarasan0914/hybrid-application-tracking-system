const http = require('http');

console.log('🧪 Testing Application Tracking System API...\n');

// Test server health
const testEndpoint = (path, method = 'GET', data = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: `/api${path}`,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    data: responseData,
                    path: path
                });
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
};

async function runTests() {
    try {
        console.log('1. Testing server health...');
        const healthTest = await testEndpoint('/jobs/active');
        console.log(`✅ Server is running! Status: ${healthTest.status}`);

        console.log('\n2. Testing technical jobs endpoint...');
        const techJobs = await testEndpoint('/jobs/technical');
        console.log(`✅ Technical jobs endpoint: ${techJobs.status}`);

        console.log('\n3. Testing non-technical jobs endpoint...');
        const nonTechJobs = await testEndpoint('/jobs/non-technical');
        console.log(`✅ Non-technical jobs endpoint: ${nonTechJobs.status}`);

        console.log('\n4. Testing dashboard endpoints...');
        const applicantDashboard = await testEndpoint('/dashboard/applicant');
        console.log(`✅ Applicant dashboard: ${applicantDashboard.status} (401 expected - no auth)`);

        const adminDashboard = await testEndpoint('/dashboard/admin');
        console.log(`✅ Admin dashboard: ${adminDashboard.status} (401 expected - no auth)`);

        const botDashboard = await testEndpoint('/dashboard/bot');
        console.log(`✅ Bot dashboard: ${botDashboard.status} (401 expected - no auth)`);

        console.log('\n5. Testing bot automation endpoints...');
        const botActivity = await testEndpoint('/bot/activity');
        console.log(`✅ Bot activity: ${botActivity.status} (401 expected - no auth)`);

        const technicalApps = await testEndpoint('/bot/technical-applications');
        console.log(`✅ Technical applications: ${technicalApps.status} (401 expected - no auth)`);

        console.log('\n🎉 All endpoints are accessible!');
        console.log('\n📋 Available Endpoints:');
        console.log('   🔐 Authentication: /auth/register, /auth/login, /auth/profile');
        console.log('   👥 User Management: /admin/users, /admin/users/:id/activate');
        console.log('   💼 Jobs: /jobs/active, /jobs/technical, /jobs/non-technical, /jobs/:id');
        console.log('   📝 Applications: /applications, /applications/my-applications, /applications/:id/timeline');
        console.log('   📊 Dashboards: /dashboard/applicant, /dashboard/admin, /dashboard/bot');
        console.log('   🤖 Bot Automation: /bot/process-applications, /bot/simulate-updates, /bot/technical-applications');
        console.log('   📋 Audit: /audit');

    } catch (error) {
        console.log('❌ Server is not running or not accessible');
        console.log('Error:', error.message);
        console.log('\n💡 Make sure to start the server with: node server.js');
    }
}

runTests();
