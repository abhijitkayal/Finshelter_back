# Backend Testing Guide - After JWT Removal

## Quick Health Checks

### 1. Server Status Check
```bash
curl -X GET "http://localhost:8000/api/admin/services" \
  -H "Content-Type: application/json"
```
**Expected**: Should return services or ask for missing parameters (not authentication errors)

### 2. Test Admin Login (No JWT Token Returned)
```bash
curl -X POST "http://localhost:8000/api/admin/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your_admin_email@example.com",
    "password": "your_admin_password"
  }'
```
**Expected**: Returns user object without JWT token

### 3. Test Employee Login (No JWT Token Returned)
```bash
curl -X POST "http://localhost:8000/api/employees/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your_employee_email@example.com", 
    "password": "your_employee_password"
  }'
```
**Expected**: Returns user object without JWT token

### 4. Test Customer Login (No JWT Token Returned)
```bash
curl -X POST "http://localhost:8000/api/customers/user-login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your_customer_email@example.com",
    "password": "your_customer_password"  
  }'
```
**Expected**: Returns user object without JWT token

### 5. Test Employee Queries (The endpoint you reported)
```bash
curl -X GET "http://localhost:8000/api/employees/queries?employeeId=YOUR_EMPLOYEE_ID_HERE"
```
**Expected**: No "Cannot read properties of undefined (reading '_id')" error

### 6. Test Employee Dashboard
```bash
curl -X GET "http://localhost:8000/api/employees/emdashboard?employeeId=YOUR_EMPLOYEE_ID_HERE"
```

### 7. Test Customer Dashboard  
```bash
curl -X GET "http://localhost:8000/api/customers/cdashboard?userId=YOUR_USER_ID_HERE"
```

### 8. Test Wallet Functionality
```bash
curl -X GET "http://localhost:8000/api/customers/wallet?userId=YOUR_USER_ID_HERE"
```

### 9. Test Contact Form (No Auth Required)
```bash
curl -X POST "http://localhost:8000/api/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Subject", 
    "message": "Test message"
  }'
```
**Expected**: Should work without any authentication

## What to Look For:

### ✅ Success Indicators:
- **No JWT/Authentication Errors**: No "Invalid token", "Access Denied", or "Authorization required" messages
- **No req.user Errors**: No "Cannot read properties of undefined (reading '_id')" errors
- **Parameter Validation**: APIs should ask for userId/employeeId instead of expecting JWT
- **Login Returns User Data**: Login endpoints return user objects, not JWT tokens
- **Proper Error Messages**: Clear messages like "User ID is required" instead of auth errors

### ❌ Failure Indicators:
- Authentication/JWT related errors
- "req.user is undefined" errors  
- Server crashes or 500 errors
- Missing parameter errors that mention tokens/auth

## Testing with Postman/Insomnia:

### Collection Setup:
1. **Base URL**: `http://srv721182.hstgr.cloud:8000`
2. **No Authorization Headers**: Remove all JWT/Bearer token headers
3. **Include IDs in Requests**: Add userId/employeeId to request bodies or query params

### Sample Requests:

#### Employee Queries (Fixed):
- **Method**: GET
- **URL**: `{{baseUrl}}/api/employees/queries?employeeId=60f1b2b2b2b2b2b2b2b2b2b2`
- **Headers**: Content-Type: application/json
- **No Authorization Header**

#### Customer Dashboard:
- **Method**: GET  
- **URL**: `{{baseUrl}}/api/customers/cdashboard?userId=60f1b2b2b2b2b2b2b2b2b2b1`
- **Headers**: Content-Type: application/json
- **No Authorization Header**

#### Update Customer Profile:
- **Method**: PUT
- **URL**: `{{baseUrl}}/api/customers/update-profile`
- **Headers**: Content-Type: application/json
- **Body**: 
```json
{
  "userId": "60f1b2b2b2b2b2b2b2b2b2b1",
  "name": "Updated Name",
  "phone": "1234567890"
}
```

## Database Check:

To get actual user/employee IDs for testing:
```javascript
// Connect to your MongoDB and run:
db.users.find({role: "employee"}).limit(5).pretty()
db.users.find({role: "customer"}).limit(5).pretty() 
db.users.find({role: "admin"}).limit(5).pretty()
```

## Common Issues After JWT Removal:

1. **Parameter Missing Errors**: APIs now need explicit userId/employeeId
2. **Frontend Updates Needed**: Remove Authorization headers, add user IDs
3. **Session Management**: Handle user sessions on client-side now
4. **Security Considerations**: Implement alternative validation if needed

## Quick Test Script:

Save this as `quick-test.sh` and run with `bash quick-test.sh`:

```bash
#!/bin/bash
echo "🧪 Quick Backend Test"
echo "Testing server health..."

# Test 1: Server health
response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8000/api/admin/services")
if [ $response -eq 200 ] || [ $response -eq 400 ]; then
    echo "✅ Server is responding (Status: $response)"
else
    echo "❌ Server issue (Status: $response)"
fi

# Test 2: Contact form (no auth needed)
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "http://localhost:8000/api/contact" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","subject":"Test","message":"Test"}')
echo "✅ Contact form test (Status: $response)"

echo "🎉 Basic tests complete!"
```