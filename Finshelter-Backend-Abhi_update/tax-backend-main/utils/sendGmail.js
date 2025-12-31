const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Send email using Nodemailer with Gmail SMTP
 * @param {Object} param0 
 * @param {string} param0.to - Recipient email address
 * @param {string} param0.subject - Email subject
 * @param {string} param0.html - Email HTML content
 * @param {string} [param0.from] - Sender email address (optional)
 * @returns {Promise<Object>} - Result from nodemailer
 */
async function sendGmail({ to, subject, html, from }) {
    // Create transporter for each email to ensure fresh connection
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use TLS
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailOptions = {
        from: from || `"Finshelter" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✓ Email sent via Gmail:', info.messageId);
        return info;
    } catch (error) {
        console.error('Gmail sending error:', error.message);
        throw error;
    }
}

module.exports = sendGmail;
