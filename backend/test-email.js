require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('Starting email test...');
console.log('Email settings:', {
  user: process.env.EMAIL_USER,
  passwordLength: process.env.EMAIL_PASSWORD?.length || 0
});

async function testEmail() {
  try {
    // Create transporter with detailed options
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      debug: true, // Enable debugging
      logger: true  // Log to console
    });

    console.log('Testing SMTP connection...');
    await transporter.verify();
    console.log('SMTP connection test passed');

    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: `"EasyManager Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'Test Email ' + new Date().toLocaleString(),
      text: 'If you see this, the email test worked!',
      html: `
        <h2>Email Test</h2>
        <p>If you see this, the email test worked!</p>
        <p>Sent at: ${new Date().toLocaleString()}</p>
      `
    });

    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));

  } catch (error) {
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack
    });
  }
}

// Run the test
testEmail()
  .then(() => console.log('Test completed'))
  .catch(console.error);
