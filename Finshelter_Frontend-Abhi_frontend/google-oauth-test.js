/**
 * Google OAuth Test Script
 * 
 * This script can be used to test the Google OAuth implementation
 * Run this in your browser console on the customer login page
 */

console.log('🧪 Google OAuth Test Helper');
console.log('================================');

// Check if Google OAuth provider is loaded
const checkGoogleOAuth = () => {
    console.log('\n1️⃣ Checking Google OAuth Provider...');
    
    if (window.google) {
        console.log('✅ Google OAuth library loaded');
        return true;
    } else {
        console.log('❌ Google OAuth library NOT loaded');
        console.log('   Check internet connection');
        return false;
    }
};

// Check localStorage for existing token
const checkAuthToken = () => {
    console.log('\n2️⃣ Checking Authentication Token...');
    
    const token = localStorage.getItem('customerToken');
    
    if (token) {
        console.log('✅ Token found in localStorage');
        console.log('   Token preview:', token.substring(0, 20) + '...');
        
        // Try to decode token
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            const decoded = JSON.parse(jsonPayload);
            console.log('   Decoded token:', decoded);
            console.log('   User ID:', decoded.userId);
            console.log('   Email:', decoded.email);
            console.log('   Role:', decoded.role);
            
            // Check expiration
            const exp = new Date(decoded.exp * 1000);
            const now = new Date();
            
            if (exp > now) {
                console.log('   Expiry:', exp.toLocaleString());
                console.log('   ✅ Token is valid');
            } else {
                console.log('   ❌ Token has expired');
                console.log('   Expired on:', exp.toLocaleString());
            }
        } catch (e) {
            console.log('   ⚠️ Could not decode token:', e.message);
        }
        
        return true;
    } else {
        console.log('❌ No token found in localStorage');
        console.log('   User is not logged in');
        return false;
    }
};

// Check backend connection
const checkBackend = async () => {
    console.log('\n3️⃣ Checking Backend Connection...');
    
    try {
        const response = await fetch('http://localhost:8000/api/customers/cdashboard', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('customerToken') || 'no-token'}`
            }
        });
        
        if (response.ok) {
            console.log('✅ Backend is responding');
            console.log('   Status:', response.status);
            return true;
        } else {
            console.log('⚠️ Backend responded with error');
            console.log('   Status:', response.status);
            const data = await response.json();
            console.log('   Error:', data);
            return false;
        }
    } catch (error) {
        console.log('❌ Cannot connect to backend');
        console.log('   Error:', error.message);
        console.log('   Make sure backend is running on port 8000');
        return false;
    }
};

// Test Google OAuth endpoint
const testGoogleEndpoint = async (testData) => {
    console.log('\n4️⃣ Testing Google OAuth Endpoint...');
    
    const data = testData || {
        name: 'Test User',
        email: 'test@gmail.com',
        googleId: 'test-google-id-' + Date.now(),
        avatarUrl: 'https://example.com/avatar.jpg'
    };
    
    console.log('   Sending test data:', data);
    
    try {
        const response = await fetch('http://localhost:8000/api/customers/google-register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ Google OAuth endpoint working');
            console.log('   Response:', result);
            
            if (result.token) {
                console.log('   ✅ Token received:', result.token.substring(0, 20) + '...');
            } else {
                console.log('   ⚠️ No token in response');
            }
            
            return true;
        } else {
            console.log('❌ Google OAuth endpoint error');
            console.log('   Response:', result);
            return false;
        }
    } catch (error) {
        console.log('❌ Error testing endpoint');
        console.log('   Error:', error.message);
        return false;
    }
};

// Clear auth data
const clearAuth = () => {
    console.log('\n🗑️ Clearing Authentication Data...');
    localStorage.removeItem('customerToken');
    console.log('✅ Token removed from localStorage');
    console.log('   Refresh the page to see login screen');
};

// Run all checks
const runAllChecks = async () => {
    console.log('\n🚀 Running All Checks...');
    console.log('================================\n');
    
    const results = {
        googleOAuth: checkGoogleOAuth(),
        token: checkAuthToken(),
        backend: await checkBackend()
    };
    
    console.log('\n📊 Summary');
    console.log('================================');
    console.log('Google OAuth Library:', results.googleOAuth ? '✅' : '❌');
    console.log('Auth Token:', results.token ? '✅' : '❌');
    console.log('Backend Connection:', results.backend ? '✅' : '❌');
    
    const allPassed = results.googleOAuth && results.backend;
    
    if (allPassed) {
        console.log('\n✅ All critical checks passed!');
        console.log('   You can now test Google Sign-In');
    } else {
        console.log('\n⚠️ Some checks failed');
        console.log('   Fix the issues above before testing');
    }
    
    return results;
};

// Export functions to window for easy access
window.googleOAuthTest = {
    checkAll: runAllChecks,
    checkGoogle: checkGoogleOAuth,
    checkToken: checkAuthToken,
    checkBackend: checkBackend,
    testEndpoint: testGoogleEndpoint,
    clearAuth: clearAuth,
    help: () => {
        console.log('\n📖 Google OAuth Test Helper');
        console.log('================================\n');
        console.log('Available commands:');
        console.log('  googleOAuthTest.checkAll()      - Run all checks');
        console.log('  googleOAuthTest.checkGoogle()   - Check if Google OAuth is loaded');
        console.log('  googleOAuthTest.checkToken()    - Check authentication token');
        console.log('  googleOAuthTest.checkBackend()  - Test backend connection');
        console.log('  googleOAuthTest.testEndpoint()  - Test Google OAuth endpoint');
        console.log('  googleOAuthTest.clearAuth()     - Clear authentication data');
        console.log('  googleOAuthTest.help()          - Show this help\n');
    }
};

console.log('\n✨ Test helper loaded!');
console.log('Type: googleOAuthTest.help() for available commands');
console.log('Type: googleOAuthTest.checkAll() to run all checks\n');

// Auto-run checks
runAllChecks();
