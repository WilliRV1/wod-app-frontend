// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react'; // <-- Import ReactNode like this
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth'; // <-- Import the TYPE like this
import { auth } from '../firebase'; // Import your configured auth instance

// Define the shape of the context data
interface AuthContextType {
    currentUser: User | null; // The logged-in user object from Firebase, or null
    loadingAuth: boolean; // To know if we are still checking the auth status
}

// Create the context with a default value
// Using 'as AuthContextType' because the initial value doesn't perfectly match,
// but the Provider will supply the correct shape.
const AuthContext = createContext<AuthContextType>({ 
    currentUser: null, 
    loadingAuth: true 
} as AuthContextType);

// Custom hook to easily use the auth context in other components
export function useAuth() {
    return useContext(AuthContext);
}

// Define the props for the Provider component
interface AuthProviderProps {
    children: ReactNode; // Standard prop for components that wrap others
}

// --- This is the main component: The Provider ---
export function AuthProvider({ children }: AuthProviderProps) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true); // Start loading

    // useEffect runs once when the component mounts
    useEffect(() => {
        // onAuthStateChanged returns an 'unsubscribe' function
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            // This function runs whenever the user logs in or out
            setCurrentUser(user); // Set the user (or null if logged out)
            setLoadingAuth(false); // We've finished checking
            console.log("Auth State Changed:", user ? user.uid : "No user");
        });

        // Cleanup function: Unsubscribe when the AuthProvider unmounts
        return unsubscribe; 
    }, []); // Empty array means run only once

    // The value that will be available to all children components
    const value = {
        currentUser,
        loadingAuth
    };

    // Render the children ONLY when not loading (optional, prevents flicker)
    // The Provider makes the 'value' available to any component inside it
    return (
        <AuthContext.Provider value={value}>
            {children} 
        </AuthContext.Provider>
    );
}