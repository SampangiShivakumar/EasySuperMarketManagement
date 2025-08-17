const nodemailer = require('nodemailer');

// Create a transporter using SMTP
const createTransporter = () => {
    console.log('Creating email transporter...');
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        debug: true, // Enable debug logging
        logger: true  // Enable built-in logger
    });

    // Verify transporter
    transporter.verify(function(error, success) {
        if (error) {
            console.error('Transporter verification failed:', error);
        } else {
            console.log('Transporter is ready to send emails');
        }
    });

    return transporter;
};

// Email templates
const emailTemplates = {
    welcome: (username) => ({
        subject: 'Welcome to EasyManager',
        text: `Welcome ${username} to EasyManager!\n\nYour account has been successfully created. You can now log in to access the system.\n\nBest regards,\nEasyManager Team`,
        html: `
            <h2>Welcome to EasyManager!</h2>
            <p>Dear ${username},</p>
            <p>Your account has been successfully created. You can now log in to access the system.</p>
            <p>Best regards,<br>EasyManager Team</p>
        `
    }),
    loginCredentials: (username, password) => ({
        subject: 'Your EasyManager Login Credentials',
        text: `Hello ${username},\n\nHere are your login credentials for EasyManager:\n\nUsername: ${username}\nPassword: ${password}\n\nPlease change your password after your first login.\n\nBest regards,\nEasyManager Team`,
        html: `
            <h2>Your EasyManager Login Credentials</h2>
            <p>Hello ${username},</p>
            <p>Here are your login credentials for EasyManager:</p>
            <p><strong>Username:</strong> ${username}<br>
            <strong>Password:</strong> ${password}</p>
            <p>Please change your password after your first login.</p>
            <p>Best regards,<br>EasyManager Team</p>
        `
    }),
    resetPassword: (username, resetLink) => ({
        subject: 'Reset Your EasyManager Password',
        text: `Hello ${username},\n\nYou have requested to reset your password. Click the following link to reset your password:\n\n${resetLink}\n\nThis link will expire in 1 hour.\n\nBest regards,\nEasyManager Team`,
        html: `
            <h2>Reset Your Password</h2>
            <p>Hello ${username},</p>
            <p>You have requested to reset your password. Click the following link to reset your password:</p>
            <p><a href="${resetLink}">Reset Password</a></p>
            <p>This link will expire in 1 hour.</p>
            <p>Best regards,<br>EasyManager Team</p>
        `
    }),
    notification: (username, message) => ({
        subject: 'EasyManager Notification',
        text: `Hello ${username},\n\n${message}\n\nBest regards,\nEasyManager Team`,
        html: `
            <h2>EasyManager Notification</h2>
            <p>Hello ${username},</p>
            <p>${message}</p>
            <p>Best regards,<br>EasyManager Team</p>
        `
    })
};

// Send email function
const sendEmail = async (to, template, data = {}) => {
    try {
        const transporter = createTransporter();
        const emailContent = emailTemplates[template](data.username, data.password || data.resetLink || data.message);
        
        const mailOptions = {
            from: `EasyManager <${process.env.EMAIL_USER}>`,
            to,
            subject: emailContent.subject,
            text: emailContent.text,
            html: emailContent.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = {
    sendEmail
};
