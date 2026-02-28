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
                const currentToken = localStorage.getItem('token');

                if (currentUser) {
                    console.log('[AuthContext] Firebase User detected:', currentUser.email);
                    setUser(currentUser);

                    // Always persist Firebase user profile so admin/checkout can read it
                    const profile = {
                        uid: currentUser.uid,
                        name: currentUser.displayName || 'User',
                        email: currentUser.email || '',
                        photoURL: currentUser.photoURL || '',
                    };
                    localStorage.setItem('freshly_user_profile', JSON.stringify(profile));

                    // Patch any existing orders that are missing userName/userEmail
                    try {
                        const existing = JSON.parse(localStorage.getItem('freshly_orders') || '[]');
                        const patched = existing.map(o => {
                            if (!o) return o;
                            const sameUser = o.userId === currentUser.uid || !o.userName || o.userName === 'Guest' || o.userName === 'Customer';
                            if (sameUser && (!o.userName || o.userName === 'Guest' || o.userName === 'Customer')) {
                                return { ...o, userName: profile.name, userEmail: profile.email, userId: currentUser.uid };
                            }
                            return o;
                        });
                        localStorage.setItem('freshly_orders', JSON.stringify(patched));
                    } catch (_) { }

                    // SESSION RECOVERY: If firebase user exists but token is lost, restore it
                    if (!currentToken) {
                        try {
                            const idToken = await currentUser.getIdToken();
                            const recoveryToken = idToken || `firebase-token-${currentUser.uid}`;
                            localStorage.setItem('token', recoveryToken);
                            console.log('[AuthContext] Session Recovered: Token restored from Firebase');
                        } catch (err) {
                            console.error('[AuthContext] Session Recovery Failed:', err);
                        }
                    }

                    if (currentUser.email === 'admin@freshly.com') {
                        setRole('admin');
                    } else {
                        const savedRole = localStorage.getItem(`role_${currentUser.uid}`) || 'customer';
                        setRole(savedRole);
                    }
                } else if (!currentToken) {
                    console.log('[AuthContext] No active session found');
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
