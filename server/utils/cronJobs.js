const cron = require('node-cron');
const User = require('../models/User');
const { sendEmail } = require('./emailService');

// Run every day at 10:00 AM
const initCronJobs = () => {
    cron.schedule('0 10 * * *', async () => {
        console.log('⏳ Running Daily Payment Reminders...');
        try {
            const users = await User.find({ 'financials.loan.active': true });
            const today = new Date();

            for (const user of users) {
                const loan = user.financials.loan;
                if (!loan.dueDate) continue;

                // Parse DD/MM/YYYY
                const [day, month, year] = loan.dueDate.split('/');
                const dueDate = new Date(year, month - 1, day);

                const diffTime = dueDate - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                // 1. Reminder: 2 days before due date
                if (diffDays === 2) {
                    await sendEmail({
                        to: user.email,
                        subject: 'Reminder: Loan Payment Due in 2 Days',
                        html: `
                            <div style="font-family: Arial, sans-serif; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px;">
                                <h2 style="color: #2563eb;">Payment Reminder 📢</h2>
                                <p>Hi ${user.name},</p>
                                <p>This is a friendly reminder that your loan payment of <strong>₹${loan.remaining.toLocaleString()}</strong> is due in <strong>2 days</strong> (${loan.dueDate}).</p>
                                <p>Please ensure timely payment to avoid late fees.</p>
                                <br>
                                <p>Best Regards,<br>AW SOCIETY Management</p>
                            </div>
                        `
                    });
                    console.log(`✅ Sent 2-day reminder to ${user.email}`);
                }

                // 2. Overdue: Date past due
                if (diffDays < 0 && loan.status !== 'overdue') {
                    // Update status in DB
                    user.financials.loan.status = 'overdue';
                    await user.save();

                    await sendEmail({
                        to: user.email,
                        subject: 'URGENT: Loan Payment Overdue',
                        html: `
                            <div style="font-family: Arial, sans-serif; border: 1px solid #fda4af; border-radius: 12px; padding: 25px; background-color: #fff1f2;">
                                <h2 style="color: #e11d48;">Payment Overdue ⚠️</h2>
                                <p>Hi ${user.name},</p>
                                <p>Your loan payment of <strong>₹${loan.remaining.toLocaleString()}</strong> was due on ${loan.dueDate} and is now <strong>OVERDUE</strong>.</p>
                                <p style="color: #e11d48; font-weight: bold;">Note: Late payment charges and interest will be applied to your account.</p>
                                <p>Please settle the amount immediately to restore your account status.</p>
                                <br>
                                <p>Best Regards,<br>AW SOCIETY Management</p>
                            </div>
                        `
                    });
                    console.log(`⚠️ Sent overdue alert to ${user.email}`);
                }
            }
        } catch (error) {
            console.error('❌ Error in Cron Job:', error);
        }
    });
};

module.exports = initCronJobs;
