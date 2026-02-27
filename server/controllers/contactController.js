const { sendEmail } = require('../utils/emailService');

exports.sendContactEmail = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Please provide all fields.' });
    }

    try {
        const result = await sendEmail({
            to: process.env.EMAIL_USER, // Send to the admin
            subject: `New Contact Message from ${name}`,
            text: `You have a new message from ${name} (${email}):\n\n${message}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #2563eb;">New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <hr />
                    <p><strong>Message:</strong></p>
                    <p style="background: #f4f4f4; padding: 15px; border-radius: 8px;">${message}</p>
                </div>
            `
        });

        if (result.success) {
            return res.status(200).json({ success: true, message: 'Message sent successfully!' });
        } else {
            return res.status(500).json({ success: false, message: 'Failed to send email.', error: result.error });
        }
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ success: false, message: 'Server error pulse check failed.' });
    }
};
