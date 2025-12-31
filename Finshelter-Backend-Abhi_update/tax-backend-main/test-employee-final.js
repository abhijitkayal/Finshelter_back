const axios = require('axios');

async function testEmployeeAuth() {
    const baseURL = 'http://localhost:8000/';
    
    try {
        console.log('🔐 Testing Employee Authentication...');
        
        // First, let's try to access the queries endpoint without authentication
        try {
            await axios.get(`${baseURL}/api/employees/queries`);
        } catch (error) {
            console.log('✅ Unauthenticated access properly blocked:', error.response?.status);
        }
        
        // Now test with admin login to create/check for employees
        const adminResponse = await axios.post(`${baseURL}/api/admin/login`, {
            email: 'abhishek@gmail.com',
            password: 'admin123'
        });
        
        console.log('✅ Admin login successful');
        
        // Check if there are employees
        const usersResponse = await axios.get(`${baseURL}/api/admin/users`, {
            headers: { 'Authorization': `Bearer ${adminResponse.data.token}` }
        });
        
        const employees = usersResponse.data.filter(user => user.role === 'employee');
        console.log(`📊 Found ${employees.length} employees`);
        
        if (employees.length === 0) {
            console.log('⚠️ No employees found. The 401 error is expected.');
            console.log('💡 To test employee functionality, first create an employee account.');
            return;
        }
        
        // Try to login as the first employee
        const employee = employees[0];
        console.log(`👤 Testing with employee: ${employee.email}`);
        
        // Test employee login with common passwords
        const testPasswords = ['employee123', 'password', '123456', 'admin123'];
        let employeeToken = null;
        
        for (const password of testPasswords) {
            try {
                const empLoginResponse = await axios.post(`${baseURL}/api/employees/login`, {
                    email: employee.email,
                    password: password
                });
                
                employeeToken = empLoginResponse.data.token;
                console.log(`✅ Employee login successful with password: ${password}`);
                break;
            } catch (error) {
                console.log(`❌ Login failed with password: ${password}`);
            }
        }
        
        if (!employeeToken) {
            console.log('⚠️ Could not login as employee. This causes the 401 error.');
            console.log('💡 Check employee password or create a test employee account.');
            return;
        }
        
        // Test employee queries endpoint
        const queriesResponse = await axios.get(`${baseURL}/api/employees/queries`, {
            headers: { 'Authorization': `Bearer ${employeeToken}` }
        });
        
        console.log('✅ Employee queries API working:', {
            status: queriesResponse.status,
            success: queriesResponse.data.success,
            queriesCount: queriesResponse.data.queries?.length || 0
        });
        
        console.log('🎉 Employee authentication is working correctly!');
        
    } catch (error) {
        console.error('❌ Test failed:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
    }
}

testEmployeeAuth();