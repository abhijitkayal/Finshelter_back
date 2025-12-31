const axios = require('axios');

async function quickTest() {
    try {
        console.log('Testing admin login and messages...');
        
        const loginResponse = await axios.post('http://localhost:8000/api/admin/login', {
            email: 'abhishek@gmail.com',
            password: 'admin123'
        });
        
        console.log('Login successful, token received:', !!loginResponse.data.token);
        
        const messagesResponse = await axios.get('http://localhost:8000/api/messages', {
            headers: {
                'Authorization': `Bearer ${loginResponse.data.token}`
            }
        });
        
        console.log('Messages API working:', messagesResponse.status === 200);
        
    } catch (error) {
        console.log('Error:', error.response?.status, error.message);
    }
}

quickTest();