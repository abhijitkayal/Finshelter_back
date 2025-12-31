// require('dotenv').config();
// const sendGmail = require('./utils/sendGmail');

// async function testContactEmail() {
//     try {
//         console.log('Testing contact email...');
//         console.log('EMAIL_USER:', process.env.EMAIL_USER);
//         console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
        
//         const testData = {
//             name: 'Test User',
//             email: 'test@example.com',
//             phone: '1234567890',
//             subject: 'Test Subject',
//             message: 'This is a test message'
//         };

//         // Email to admin
//         const adminMailOptions = {
//             to: process.env.ADMIN_EMAIL,
//             subject: `New Contact Form Submission: ${testData.subject}`,
//             html: `
//                 <h2>New Contact Form Submission</h2>
//                 <p><strong>Name:</strong> ${testData.name}</p>
//                 <p><strong>Email:</strong> ${testData.email}</p>
//                 <p><strong>Phone:</strong> ${testData.phone}</p>
//                 <p><strong>Subject:</strong> ${testData.subject}</p>
//                 <p><strong>Message:</strong></p>
//                 <p>${testData.message}</p>
//             `,
//         };

//         console.log('Sending email to:', adminMailOptions.to);
//         const result = await sendGmail(adminMailOptions);
//         console.log('✓ Email sent successfully!', result.messageId);
        
//     } catch (error) {
//         console.error('✗ Email sending failed:');
//         console.error('Error message:', error.message);
//         console.error('Error code:', error.code);
//         console.error('Full error:', error);
//     }
// }

// testContactEmail();
