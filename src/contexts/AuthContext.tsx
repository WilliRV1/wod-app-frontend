// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react'; // Import ReactNode como tipo
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth'; // Import User como tipo
import { auth } from '../firebase'; 

// Define la forma de los datos del contexto
interface AuthContextType {
    currentUser: User | null; 
    loadingAuth: boolean; 
}

// Crea el contexto con un valor por defecto
const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    loadingAuth: true
} as AuthContextType);

// Hook personalizado para usar el contexto fácilmente
export function useAuth() {
    return useContext(AuthContext);
}

// Props para el componente Proveedor
interface AuthProviderProps {
    children: ReactNode; 
}

// --- Componente Proveedor Principal ---
export function AuthProvider({ children }: AuthProviderProps) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true); 

    useEffect(() => {
        // onAuthStateChanged devuelve una función para desuscribirse
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user); 
            setLoadingAuth(false); 
            console.log("Auth State Changed:", user ? user.uid : "No user");
        });

        // Función de limpieza: Se desuscribe cuando el componente se desmonta
        return unsubscribe;
    }, []); 

    // El valor disponible para los hijos
    const value = {
        currentUser,
        loadingAuth
    };

    // Renderiza los hijos (componentes envueltos)
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}