const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        mongoose.set('bufferCommands', false);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected Successfully');

        // Seed Admin
        const User = require('./models/User');
        const adminEmail = 'tsonukumar715@gmail.com';
        const adminPassword = '847201';

        const adminExists = await User.findOne({ email: adminEmail });
        if (!adminExists) {
            await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
                mobile: '9999999999',
                address: 'Main Society Headquarters',
                pincode: '110001'
            });
            console.log('Admin User Seeded');
        }

        // Seed initial settings
        const Settings = require('./models/Settings');
        const defaultSettings = [
            { key: 'monthlyPlan', value: 1000, description: 'Default monthly contribution' },
            { key: 'interestRate', value: 2, description: 'Default loan interest rate (%)' },
            { key: 'loanDuration', value: 12, description: 'Default loan duration (months)' }
        ];

        for (const s of defaultSettings) {
            const exists = await Settings.findOne({ key: s.key });
            if (!exists) {
                await new Settings(s).save();
                console.log(`Setting created: ${s.key}`);
            }
        }

    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error.message);
        console.error('👉 Please make sure your IP is WHITELISTED in MongoDB Atlas.');
        // Don't exit process so server doesn't die
    }
};

module.exports = connectDB;
