export const sendSMS = async (numbers, message) => {
    // This is a placeholder for SMS API integration. 
    // You can use services like Fast2SMS, Twilio, or Vonage.

    // Fast2SMS (Common in India):
    const API_KEY = 'YOUR_FAST2SMS_API_KEY';

    const numbersStr = Array.isArray(numbers) ? numbers.join(',') : numbers;

    console.log(`[SMS Notification] To: ${numbersStr} | Message: ${message}`);

    // If no real API key is provided, we just log it.
    // In a real production app, you would use a backend to hide your API Key.
    if (!API_KEY || API_KEY === 'YOUR_FAST2SMS_API_KEY') {
        return { success: true, dummy: true };
    }

    try {
        const response = await fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=${API_KEY}&route=q&message=${encodeURIComponent(message)}&flash=0&numbers=${numbersStr}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('SMS sending failed:', error);
        return { success: false, error };
    }
};
