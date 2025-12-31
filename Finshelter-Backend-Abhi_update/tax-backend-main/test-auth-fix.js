// const axios = require('axios');

// async function testAuthenticationFix() {
//     const baseURL = 'http://srv721182.hstgr.cloud:8000';
    
//     try {
//         console.log('🔐 Testing Admin Login...');
        
//         // Step 1: Admin Login
//         const loginResponse = await axios.post(`${baseURL}/api/admin/login`, {
//             email: 'abhishek@gmail.com',
//             password: 'admin123'
//         });
        
//         console.log('✅ Admin Login Response:', {
//             success: loginResponse.data.success,
//             hasToken: !!loginResponse.data.token,
//             user: loginResponse.data.user
//         });
        
//         const token = loginResponse.data.token;
        
//         if (!token) {
//             throw new Error('No token received from login');
//         }
        
//         console.log('📨 Testing Messages API...');
        
//         // Step 2: Fetch Messages with Authentication
//         const messagesResponse = await axios.get(`${baseURL}/api/messages`, {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             },
//             params: {
//                 customerId: '',
//                 serviceId: '',
//                 orderId: ''
//             }
//         });
        
//         console.log('✅ Messages API Response:', {
//             status: messagesResponse.status,
//             hasMessages: Array.isArray(messagesResponse.data.messages),
//             messageCount: messagesResponse.data.messages?.length || 0
//         });
        
//         console.log('🎉 All tests passed! Authentication is working correctly.');
        
//     } catch (error) {
//         console.error('❌ Test failed:', {
//             message: error.message,
//             status: error.response?.status,
//             data: error.response?.data
//         });
//     }
// }

// testAuthenticationFix();