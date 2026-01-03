const nodemailer = require('nodemailer');
const { SendMailClient } = require('zeptomail');
require('dotenv').config();

/**
 * Email type constants for different ZeptoMail API keys
 */
const EMAIL_TYPES = {
    PASSWORD_RESET: 'PASSWORD_RESET',
    WELCOME: 'WELCOME',
    PAYMENTS: 'PAYMENTS',
    GENERAL: 'GENERAL'
};

/**
 * Template keys for ZeptoMail templates
 */
const TEMPLATE_KEYS = {
    PASSWORD_RESET: '2518b.1957fc0b999b51fc.k1.c20b0950-252b-11f0-a277-62df313bf14d.19682e90665',
    WELCOME: '2518b.1957fc0b999b51fc.k1.158392d0-1c6e-11f0-ab18-d2cf08f4ca8c.19649a0347d'
};

/**
 * Get ZeptoMail API key based on email type
 * @param {string} emailType - Type of email (PASSWORD_RESET, WELCOME, PAYMENTS, GENERAL)
 * @returns {string} - ZeptoMail API key
 */
function getApiKey(emailType) {
    const apiKeys = {
        [EMAIL_TYPES.PASSWORD_RESET]: process.env.ZEPTO_MAIL_PASSWORD_RESET,
        [EMAIL_TYPES.WELCOME]: process.env.ZEPTO_MAIL_WELCOME,
        [EMAIL_TYPES.PAYMENTS]: process.env.ZEPTO_MAIL_PAYMENTS,
        [EMAIL_TYPES.GENERAL]: process.env.ZEPTO_MAIL_GENERAL
    };

    return apiKeys[emailType] || process.env.ZEPTO_MAIL_GENERAL;
}

/**
 * Create ZeptoMail transport with specific API key
 * @param {string} apiKey - ZeptoMail API key
 * @returns {Object} - Nodemailer transport object
 */
function createTransport(apiKey) {
    return nodemailer.createTransport({
        host: "smtp.zeptomail.in",
        port: 587,
        auth: {
            user: "emailapikey",
            pass: apiKey
        }
    });
}

/**
 * Send email using ZeptoMail template with specific API key based on email type
 * @param {Object} param0 
 * @param {string} param0.to - Recipient email address
 * @param {string} param0.name - Recipient name
 * @param {Object} param0.templateData - Template merge data
 * @param {string} [param0.from] - Sender email address (optional)
 * @param {string} param0.emailType - Email type (PASSWORD_RESET or WELCOME)
 * @returns {Promise<Object>} - Result from ZeptoMail
 */
async function sendZeptoMailTemplate({ to, name, templateData, from, emailType }) {
    if (!emailType || (!TEMPLATE_KEYS[emailType])) {
        throw new Error(`Invalid email type for template: ${emailType}`);
    }

    const apiKey = getApiKey(emailType);
    const templateKey = TEMPLATE_KEYS[emailType];
    
    console.log(`📧 Attempting to send template email (Type: ${emailType})`);
    console.log(`📧 Template Key: ${templateKey}`);
    console.log(`📧 To: ${to}, Name: ${name}`);
    console.log(`📧 Merge Data:`, templateData);
    
    const url = "https://api.zeptomail.in/v1.1/email/template";
    const client = new SendMailClient({ url, token: apiKey });

    try {
        const result = await client.sendMailWithTemplate({
            template_key: templateKey,
            from: {
                address: from || "noreply@thefinshelter.com",
                name: "Finshelter"
            },
            to: [{
                email_address: {
                    address: to,
                    name: name || ""
                }
            }],
            merge_info: templateData
        });
        
        console.log(`✓ Template email sent successfully via ZeptoMail (Type: ${emailType})`);
        console.log(`✓ Result:`, result);
        return result;
    } catch (error) {
        console.error(`✗ Failed to send template email via ZeptoMail (Type: ${emailType}):`, error);
        console.error(`✗ Error details:`, error.message);
        if (error.response) {
            console.error(`✗ Response status:`, error.response.status);
            console.error(`✗ Response data:`, error.response.data);
        }
        throw error;
    }
}

/**
 * Send email using ZeptoMail SMTP with specific API key based on email type
 * @param {Object} param0 
 * @param {string} param0.to - Recipient email address
 * @param {string} param0.subject - Email subject
 * @param {string} param0.html - Email HTML content
 * @param {string} [param0.from] - Sender email address (optional)
 * @param {string} [param0.emailType] - Email type (PASSWORD_RESET, WELCOME, PAYMENTS, GENERAL)
 * @returns {Promise<Object>} - Result from nodemailer
 */
async function sendZeptoMail({ to, subject, html, from, emailType = EMAIL_TYPES.GENERAL }) {
    const apiKey = getApiKey(emailType);
    const transport = createTransport(apiKey);
    
    const mailOptions = {
        from: from || '"Finshelter" <noreply@thefinshelter.com>',
        to,
        subject,
        html
    };

    try {
        const info = await transport.sendMail(mailOptions);
        console.log(`✓ Email sent successfully via ZeptoMail (Type: ${emailType})`);
        return info;
    } catch (error) {
        console.error(`✗ Failed to send email via ZeptoMail (Type: ${emailType}):`, error.message);
        throw error;
    }
}

// Export functions and constants
module.exports = sendZeptoMail;
module.exports.sendZeptoMailTemplate = sendZeptoMailTemplate;
module.exports.EMAIL_TYPES = EMAIL_TYPES;
module.exports.TEMPLATE_KEYS = TEMPLATE_KEYS;
