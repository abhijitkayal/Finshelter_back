const mongoose = require('mongoose');
const User = require('./models/userModel');

async function checkUser() {
    try {
        await mongoose.connect('mongodb://localhost:27017/tax-service-db');
        console.log('Connected to MongoDB');

        const user = await User.findOne({ 
            $or: [
                {email: 'kayalabhi04@gmail.com'}, 
                {username: 'abhi'}
            ] 
        });
        
        if (user) {
            console.log('\nUser EXISTS in database:');
            console.log('Email:', user.email);
            console.log('Username:', user.username);
            console.log('Name:', user.name, user.lastname);
            console.log('Created:', user.createdAt);
            console.log('\nSOLUTION: Either use the CORRECT password for this account, or use a DIFFERENT email/username to create a new account.');
        } else {
            console.log('\nNo user found with this email or username.');
            console.log('You can proceed with registration.');
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkUser();
