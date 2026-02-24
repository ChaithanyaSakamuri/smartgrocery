import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, signInWithPopup, signInWithPhoneNumber, RecaptchaVerifier } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null); // 'customer', 'vendor', 'admin'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing backend session on load
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');
            if (token && savedUser) {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                setRole(parsedUser.role || 'customer');
            }

            const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
                if (currentUser && !token) {
                    setUser(currentUser);
                    if (currentUser.email === 'admin@freshly.com') {
                        setRole('admin');
                    } else {
                        const savedRole = localStorage.getItem(`role_${currentUser.uid}`) || 'customer';
                        setRole(savedRole);
                    }
                } else if (!token) {
                    setUser(null);
                    setRole(null);
                }
                setLoading(false);
            });
            return unsubscribe;
        };

        const unsubscribePromise = initializeAuth();
        return () => {
            unsubscribePromise.then(unsubscribe => unsubscribe());
        };
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setRole(userData.role);
    };

    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            return result.user;
        } catch (error) {
            console.error("Google Login Error:", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem(`role_${user?.uid}`);
        setUser(null);
        setRole(null);
        return signOut(auth);
    };

    const value = {
        user,
        role,
        setRole,
        loading,
        login,
        loginWithGoogle,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
