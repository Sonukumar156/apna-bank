const crypto = require('crypto');

/**
 * Generates a professional uppercase alphanumeric ID with a prefix.
 * @param {string} prefix - e.g., 'REG', 'TXN', 'LOAN'
 * @param {number} length - length of random part (default 4)
 * @returns {string} - e.g., AS-REG-A4B7
 */
const generateId = (prefix, length = 4) => {
    const randomPart = crypto.randomBytes(length)
        .toString('hex')
        .substring(0, length)
        .toUpperCase();
    
    // Check if it's alphanumeric (crypto.randomBytes().toString('hex') is strictly hex [0-9A-F])
    // If we want more characters (A-Z), we can use a custom charset. Let's do a custom charset.
    const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    const bytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
        result += charset[bytes[i] % charset.length];
    }
    
    return `AS-${prefix}-${result}`;
};

module.exports = { generateId };
