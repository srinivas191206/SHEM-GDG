import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../services/authApi';

interface User {
    username?: string;
    email?: string;
    id?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Check for token on initial load
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    setUser({ email: 'user@example.com' });
                }
            } catch (error) {
                console.error("Auth check failed:", error);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        // Demo Mode Bypass
        if (email === 'demo@shem.pro' && password === 'demo123') {
            const demoUser = { username: 'Demo User', email: 'demo@shem.pro', id: 'demo-123' };
            localStorage.setItem('token', 'demo-token-bypass');
            setUser(demoUser);
            return;
        }

        try {
            await authApi.loginUser(email, password);
            // loginUser in authApi already sets localStorage token
            setUser({ email }); // simplistic user setting
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const register = async (userData: any) => {
        try {
            const data = await authApi.registerUser(userData);
            if (data.token) {
                localStorage.setItem('token', data.token);
                setUser({ email: userData.email });
            }
        } catch (error) {
            console.error("Registration failed", error);
            throw error;
        }
    };

    const logout = () => {
        authApi.logoutUser();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            isAuthenticated: !!user
        }}>
            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
                    <p className="mt-4 text-gray-600 font-semibold">Loading SHEM...</p>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
