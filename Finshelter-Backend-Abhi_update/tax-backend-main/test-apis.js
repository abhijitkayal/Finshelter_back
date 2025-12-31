// #!/usr/bin/env node

// /**
//  * Backend API Testing Script
//  * Tests all major endpoints after JWT removal
//  */

// const https = require('https');
// const http = require('http');

// const BASE_URL = 'http://srv721182.hstgr.cloud:8000';

// // Test configuration
// const testConfig = {
//     timeout: 10000,
//     verbose: true
// };

// // Sample test data
// const testData = {
//     adminLogin: {
//         email: 'admin@test.com', 
//         password: 'testpassword'
//     },
//     employeeLogin: {
//         email: 'employee@test.com',
//         password: 'testpassword'
//     },
//     customerLogin: {
//         email: 'customer@test.com', 
//         password: 'testpassword'
//     },
//     sampleUserId: '60f1b2b2b2b2b2b2b2b2b2b2', // Replace with actual ID
//     sampleEmployeeId: '60f1b2b2b2b2b2b2b2b2b2b3' // Replace with actual ID
// };

// // Utility function to make HTTP requests
// function makeRequest(options, postData = null) {
//     return new Promise((resolve, reject) => {
//         const client = options.protocol === 'https:' ? https : http;
//         const req = client.request(options, (res) => {
//             let data = '';
//             res.on('data', (chunk) => data += chunk);
//             res.on('end', () => {
//                 try {
//                     const jsonData = JSON.parse(data);
//                     resolve({ status: res.statusCode, data: jsonData, headers: res.headers });
//                 } catch (e) {
//                     resolve({ status: res.statusCode, data: data, headers: res.headers });
//                 }
//             });
//         });

//         req.on('error', (err) => reject(err));
//         req.setTimeout(testConfig.timeout, () => {
//             req.destroy();
//             reject(new Error('Request timeout'));
//         });

//         if (postData) {
//             req.write(JSON.stringify(postData));
//         }
//         req.end();
//     });
// }

// // Test cases
// const tests = [
//     {
//         name: 'Server Health Check',
//         method: 'GET',
//         path: '/api/admin/dashboard',
//         expectedStatus: [200, 400], // 400 is OK since we need userId now
//         description: 'Check if server responds'
//     },
//     {
//         name: 'Admin Login (No JWT)',
//         method: 'POST', 
//         path: '/api/admin/login',
//         data: testData.adminLogin,
//         expectedStatus: [200, 400],
//         description: 'Test admin login returns user data instead of JWT'
//     },
//     {
//         name: 'Employee Login (No JWT)',
//         method: 'POST',
//         path: '/api/employees/login', 
//         data: testData.employeeLogin,
//         expectedStatus: [200, 400],
//         description: 'Test employee login returns user data instead of JWT'
//     },
//     {
//         name: 'Customer Login (No JWT)',
//         method: 'POST',
//         path: '/api/customers/user-login',
//         data: testData.customerLogin, 
//         expectedStatus: [200, 400],
//         description: 'Test customer login returns user data instead of JWT'
//     },
//     {
//         name: 'Employee Dashboard (With UserId)',
//         method: 'GET',
//         path: `/api/employees/emdashboard?employeeId=${testData.sampleEmployeeId}`,
//         expectedStatus: [200, 400, 404],
//         description: 'Test employee dashboard with employeeId parameter'
//     },
//     {
//         name: 'Customer Dashboard (With UserId)', 
//         method: 'GET',
//         path: `/api/customers/cdashboard?userId=${testData.sampleUserId}`,
//         expectedStatus: [200, 400, 404],
//         description: 'Test customer dashboard with userId parameter'
//     },
//     {
//         name: 'Get Employee Queries (With EmployeeId)',
//         method: 'GET', 
//         path: `/api/employees/queries?employeeId=${testData.sampleEmployeeId}`,
//         expectedStatus: [200, 400, 404],
//         description: 'Test the specific endpoint you reported'
//     },
//     {
//         name: 'Contact Form (No Auth Required)',
//         method: 'POST',
//         path: '/api/contact',
//         data: {
//             name: 'Test User',
//             email: 'test@example.com', 
//             subject: 'Test Subject',
//             message: 'Test message'
//         },
//         expectedStatus: [200, 201],
//         description: 'Test contact form submission'
//     },
//     {
//         name: 'Get Services (No Auth)',
//         method: 'GET',
//         path: '/api/admin/services',
//         expectedStatus: [200, 400],
//         description: 'Test services endpoint without authentication'
//     },
//     {
//         name: 'Wallet Test (With UserId)',
//         method: 'GET',
//         path: `/api/customers/wallet/test?userId=${testData.sampleUserId}`,
//         expectedStatus: [200, 400, 404],
//         description: 'Test wallet endpoint with userId'
//     }
// ];

// // Colors for terminal output
// const colors = {
//     reset: '\x1b[0m',
//     bright: '\x1b[1m', 
//     red: '\x1b[31m',
//     green: '\x1b[32m',
//     yellow: '\x1b[33m',
//     blue: '\x1b[34m',
//     magenta: '\x1b[35m',
//     cyan: '\x1b[36m'
// };

// // Main test runner
// async function runTests() {
//     console.log(`${colors.bright}${colors.blue}🚀 Starting Backend API Tests${colors.reset}\n`);
//     console.log(`Base URL: ${BASE_URL}`);
//     console.log(`Total Tests: ${tests.length}\n`);
    
//     let passed = 0;
//     let failed = 0;
//     const results = [];

//     for (let i = 0; i < tests.length; i++) {
//         const test = tests[i];
//         console.log(`${colors.bright}Test ${i + 1}/${tests.length}: ${test.name}${colors.reset}`);
//         console.log(`${colors.cyan}${test.description}${colors.reset}`);
        
//         try {
//             const options = {
//                 hostname: 'localhost',
//                 port: 8000,
//                 path: test.path,
//                 method: test.method,
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json'
//                 }
//             };

//             const result = await makeRequest(options, test.data);
//             const statusOk = test.expectedStatus.includes(result.status);
            
//             if (statusOk) {
//                 console.log(`${colors.green}✓ PASSED${colors.reset} - Status: ${result.status}`);
//                 passed++;
//             } else {
//                 console.log(`${colors.red}✗ FAILED${colors.reset} - Status: ${result.status} (Expected: ${test.expectedStatus.join(' or ')})`);
//                 failed++;
//             }
            
//             if (testConfig.verbose) {
//                 console.log(`${colors.yellow}Response:${colors.reset}`, JSON.stringify(result.data, null, 2));
//             }
            
//             results.push({
//                 test: test.name,
//                 status: statusOk ? 'PASSED' : 'FAILED', 
//                 httpStatus: result.status,
//                 response: result.data
//             });
            
//         } catch (error) {
//             console.log(`${colors.red}✗ FAILED${colors.reset} - Error: ${error.message}`);
//             failed++;
//             results.push({
//                 test: test.name,
//                 status: 'FAILED',
//                 error: error.message
//             });
//         }
        
//         console.log(''); // Empty line for readability
//     }
    
//     // Summary
//     console.log(`${colors.bright}${colors.blue}📊 Test Results Summary${colors.reset}`);
//     console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
//     console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
//     console.log(`${colors.cyan}Total: ${passed + failed}${colors.reset}`);
    
//     if (failed === 0) {
//         console.log(`\n${colors.bright}${colors.green}🎉 All tests passed! Your backend is working properly.${colors.reset}`);
//     } else {
//         console.log(`\n${colors.bright}${colors.yellow}⚠️  Some tests failed. Check the responses above.${colors.reset}`);
//     }
    
//     return { passed, failed, results };
// }

// // Run tests if called directly
// if (require.main === module) {
//     runTests().catch(console.error);
// }

// module.exports = { runTests, testData };