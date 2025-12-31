// const axios = require('axios');

// async function testAuth() {
//     try {
//         console.log('Testing admin login and messages API...');
        
//         // Test admin login
//         const loginResponse = await axios.post('http://localhost:8000/api/admin/login', {
//             email: 'abhishek@gmail.com',
//             password: 'Test@123'
//         });
        
//         console.log('✅ Admin login successful');
//         console.log('Token received:', !!loginResponse.data.token);
        
//         const token = loginResponse.data.token;
        
//         // Test messages API with token
//         const messagesResponse = await axios.get('http://localhost:8000/api/messages', {
//             headers: {
//                 Authorization: `Bearer ${token}`
//             }
//         });
        
//         console.log('✅ Messages API successful');
//         console.log('Messages count:', messagesResponse.data.messages?.length || 0);
        
//     } catch (error) {
//         console.log('❌ Error:', error.response?.data?.message || error.message);
//         if (error.response?.status) {
//             console.log('Status code:', error.response.status);
//         }
//     }
// }

// testAuth();