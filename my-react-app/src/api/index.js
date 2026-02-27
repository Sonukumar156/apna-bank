const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.1.4:5000/api';

const handleResponse = async (res, defaultError) => {
    if (!res.ok) {
        try {
            const error = await res.json();
            throw new Error(error.message || defaultError);
        } catch (e) {
            throw new Error(defaultError);
        }
    }
    return res.json();
};

export const loginUser = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    return handleResponse(res, 'Login failed');
};

export const registerUser = async (userData) => {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    return handleResponse(res, 'Registration failed');
};

export const getStats = async () => {
    const res = await fetch(`${API_URL}/users/get-dashboard-stats`);
    return handleResponse(res, 'Failed to fetch stats');
};

export const getMembers = async () => {
    const res = await fetch(`${API_URL}/users/get-members-list`);
    return handleResponse(res, 'Failed to fetch members');
};

export const deleteMember = async (userId) => {
    const res = await fetch(`${API_URL}/users/members/${userId}`, {
        method: 'DELETE'
    });
    return handleResponse(res, 'Failed to delete member');
};

export const addTransaction = async (transactionData) => {
    const res = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData)
    });
    return handleResponse(res, 'Failed to add transaction');
};

export const distributeBonus = async (bonusData) => {
    const res = await fetch(`${API_URL}/transactions/distribute-bonus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bonusData)
    });
    return handleResponse(res, 'Failed to distribute bonus');
};

export const getTransactions = async () => {
    const res = await fetch(`${API_URL}/transactions/fetch-all-history`);
    return handleResponse(res, 'Failed to fetch transactions');
};

export const getUserTransactions = async (userId) => {
    const res = await fetch(`${API_URL}/transactions/fetch-user-history/${userId}`);
    return handleResponse(res, 'Failed to fetch user transactions');
};

export const updateMemberFinancials = async (userId, financials) => {
    const res = await fetch(`${API_URL}/users/members/${userId}/financials`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ financials })
    });
    return handleResponse(res, 'Failed to update financials');
};

export const updateProfile = async (userId, data) => {
    const res = await fetch(`${API_URL}/users/profile/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return handleResponse(res, 'Failed to update profile');
};

export const getSettings = async () => {
    const res = await fetch(`${API_URL}/settings`);
    return handleResponse(res, 'Failed to fetch settings');
};

export const updateSettings = async (key, value) => {
    const res = await fetch(`${API_URL}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
    });
    return handleResponse(res, 'Failed to update settings');
};

export const saveReceipt = async (receiptData) => {
    const res = await fetch(`${API_URL}/transactions/save-receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(receiptData)
    });
    return handleResponse(res, 'Failed to save receipt');
};

export const getReceipt = async (transactionId) => {
    const res = await fetch(`${API_URL}/transactions/receipt/${transactionId}`);
    return handleResponse(res, 'Receipt not found');
};
