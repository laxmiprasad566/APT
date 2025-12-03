import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/api/client';

interface User {
    id: string;
    google_id: string;
    email: string;
    name: string;
    avatar_url: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const currentUser = await api.getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error('Failed to fetch user', error);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);

    const login = () => {
        // Redirect to backend auth endpoint
        window.location.href = 'http://localhost:3000/auth/google';
    };

    const logout = async () => {
        try {
            await api.logout();
            setUser(null);
        } catch (error) {
            console.error('Failed to logout', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
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
