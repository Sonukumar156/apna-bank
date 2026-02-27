const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Incorrect email or password.' });
        }
        // In a real app, generate a JWT token here
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.register = async (req, res) => {
    try {
        const { email, mobile } = req.body;

        // Mobile Validation
        if (!/^[789]\d{9}$/.test(mobile)) {
            return res.status(400).json({ message: 'Invalid mobile number. Must be 10 digits starting with 7, 8, or 9.' });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const existingMobile = await User.findOne({ mobile });
        if (existingMobile) {
            return res.status(400).json({ message: 'Mobile number already registered' });
        }

        const userData = {
            ...req.body,
            role: 'user',
            regNo: `AS-${Math.floor(10000 + Math.random() * 90000)}`,
            financials: {
                collection: { status: 'due', amount: 0, date: null },
                loan: { active: false, amount: 0, interest: 0, remaining: 0 }
            }
        };

        const newUser = new User(userData);
        await newUser.save();

        // Send Welcome Email
        try {
            await sendEmail({
                to: newUser.email,
                subject: 'Welcome to APNA SOCIETY!',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
                        <div style="background-color: #0f172a; padding: 20px; text-align: center; color: white;">
                            <h1 style="margin: 0;">APNA SOCIETY</h1>
                        </div>
                        <div style="padding: 20px; color: #333;">
                            <h2>Welcome, ${newUser.name}!</h2>
                            <p>Your registration is successful. We are glad to have you in our community.</p>
                            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                <p style="margin: 5px 0;"><strong>Registration ID:</strong> ${newUser.regNo}</p>
                                <p style="margin: 5px 0;"><strong>Initial Plan:</strong> ₹${newUser.planAmount || 1000}</p>
                            </div>
                            <p>You can now login to your dashboard to manage your society funds and loans.</p>
                            <p style="margin-top: 30px;">Best Regards,<br>Management Team</p>
                        </div>
                    </div>
                `
            });
        } catch (emailErr) {
            console.error('Welcome email failed:', emailErr);
        }
        res.status(201).json({
            message: 'Registration successful! You can now login.',
            user: newUser
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
