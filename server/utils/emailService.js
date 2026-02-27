const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to your email provider
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS  // Your email app password
    }
});

exports.sendEmail = async ({ to, subject, text, html, attachments }) => {
    try {
        const mailOptions = {
            from: `"APNA SOCIETY" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
            attachments
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent: ' + info.response);
        return { success: true, info };
    } catch (error) {
        console.error('❌ Email sending failed:', error);
        return { success: false, error: error.message };
    }
};
