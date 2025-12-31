// // Quick test to verify admin authentication works
// const axios = require('axios');

// async function testAdminAuth() {
//     try {
//         console.log('Testing admin login...');
        
//         // Test admin login - using actual admin credentials
//         const loginResponse = await axios.post('http://localhost:8000/api/admin/login', {
//             email: 'rkiran352@gmail.com',
//             password: 'admin@1ZNu!>9z'
//         }).catch(err => {
//             console.log('Login request error:');
//             console.log('Network error:', err.code);
//             console.log('Message:', err.message);
//             throw err;
//         });
        
//         console.log('Login successful:', loginResponse.data);
        
//         if (loginResponse.data.token) {
//             console.log('Token received:', loginResponse.data.token.substring(0, 50) + '...');
            
//             // Test messages endpoint with token
//             console.log('\nTesting messages endpoint...');
//             const messagesResponse = await axios.get('http://localhost:8000/api/messages', {
//                 headers: {
//                     'Authorization': `Bearer ${loginResponse.data.token}`
//                 }
//             });
            
//             console.log('Messages endpoint successful:', messagesResponse.status);
//             console.log('Messages received:', messagesResponse.data.messages?.length || 0);
//         } else {
//             console.log('No token received from login!');
//         }
        
//     } catch (error) {
//         console.error('Test failed:');
//         console.error('Status:', error.response?.status);
//         console.error('Data:', error.response?.data);
//         console.error('Message:', error.message);
//     }
// }

// testAdminAuth();