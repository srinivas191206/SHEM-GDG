import api from '../services/api';

const registerUser = async (userData: any) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
};

const loginUser = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.token) {
        localStorage.setItem('token', res.data.token);
    }
    return res.data;
};

const logoutUser = () => {
    localStorage.removeItem('token');
};

export const authApi = {
    registerUser,
    loginUser,
    logoutUser,
};
