// const axios = require('axios');

// async function testEmployeeAuth() {
//     const baseURL = 'http://srv721182.hstgr.cloud:8000';
    
//     try {
//         console.log('🔐 Testing Employee Login...');
        
//         // Step 1: Employee Login - Let me check if there are any employees
//         // First, let's check admin login to get admin data and see employees
//         const adminResponse = await axios.post(`${baseURL}/api/admin/login`, {
//             email: 'abhishek@gmail.com',
//             password: 'admin123'
//         });
        
//         const adminToken = adminResponse.data.token;
//         console.log('✅ Admin logged in successfully');
        
//         // Get all users to find an employee
//         const usersResponse = await axios.get(`${baseURL}/api/admin/users`, {
//             headers: {
//                 'Authorization': `Bearer ${adminToken}`
//             }
//         });
        
//         const employees = usersResponse.data.filter(user => user.role === 'employee');
//         console.log('📊 Found employees:', employees.length);
        
//         if (employees.length > 0) {
//             const employee = employees[0];
//             console.log('👤 Testing with employee:', employee.email);
            
//             // Try employee login (assuming default password)
//             try {
//                 const empLoginResponse = await axios.post(`${baseURL}/api/employees/login`, {
//                     email: employee.email,
//                     password: 'employee123' // common default password
//                 });
                
//                 console.log('✅ Employee Login Response:', {
//                     success: empLoginResponse.data.success,
//                     hasToken: !!empLoginResponse.data.token
//                 });
                
//                 const empToken = empLoginResponse.data.token;
                
//                 // Test employee queries endpoint
//                 const queriesResponse = await axios.get(`${baseURL}/api/employees/queries`, {
//                     headers: {
//                         'Authorization': `Bearer ${empToken}`
//                     }
//                 });
                
//                 console.log('✅ Employee Queries API Response:', {
//                     status: queriesResponse.status,
//                     hasQueries: Array.isArray(queriesResponse.data.queries)
//                 });
                
//                 console.log('🎉 Employee authentication is working correctly!');
                
//             } catch (empError) {
//                 console.error('❌ Employee login/queries failed:', {
//                     message: empError.message,
//                     status: empError.response?.status,
//                     data: empError.response?.data
//                 });
//             }
//         } else {
//             console.log('⚠️ No employees found in database');
//         }
        
//     } catch (error) {
//         console.error('❌ Test failed:', {
//             message: error.message,
//             status: error.response?.status,
//             data: error.response?.data
//         });
//     }
// }

// testEmployeeAuth();