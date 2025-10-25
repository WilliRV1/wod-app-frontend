import React, { useState } from 'react';
import { auth } from '../firebase'; // Importa la instancia de auth
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "firebase/auth"; // Importa las funciones de Firebase Auth
import { registerUserProfile } from '../services/user.service'; // Importa el servicio del backend

function LoginPage() {
    // Estados para los campos del formulario
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState(''); // Para el registro
    const [apellidos, setApellidos] = useState(''); // Para el registro
    const [isRegistering, setIsRegistering] = useState(false); // Para mostrar/ocultar campos de registro

    // Estados para mensajes y errores
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    // --- MANEJADOR DE REGISTRO ---
    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault(); // Evita que el formulario recargue la página
        setError(null);
        setMessage(null);

        try {
            // 1. Crear usuario en Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("Usuario creado en Firebase:", user.uid);
            setMessage(`¡Cuenta creada para ${user.email}! Registrando perfil...`);

            // 2. Registrar perfil en nuestro Backend (MongoDB)
            await registerUserProfile({
                firebaseUid: user.uid,
                email: user.email || email, // Usamos el email de Firebase o el del formulario
                nombre: nombre,
                apellidos: apellidos,
                rol: 'atleta' // Por defecto, todos se registran como atletas
            });

            setMessage("¡Registro completo! Ahora puedes iniciar sesión.");
            // Limpiar campos o redirigir...
            setEmail('');
            setPassword('');
            setNombre('');
            setApellidos('');
            setIsRegistering(false);

        } catch (error: any) { // Un solo bloque catch para cualquier error (Firebase o Backend)
            console.error("Error en Registro:", error);
            // Mapear errores comunes de Firebase a mensajes amigables
            if (error.code === 'auth/email-already-in-use') {
                setError('El correo electrónico ya está registrado.');
            } else if (error.code === 'auth/weak-password') {
                setError('La contraseña debe tener al menos 6 caracteres.');
            } else {
                // Error genérico para otros problemas (Firebase o Backend)
                setError('Error al registrar. Verifica tus datos e intenta de nuevo.');
            }
        }
    };

    // --- MANEJADOR DE INICIO DE SESIÓN ---
    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setMessage(null);

        try {
            // 1. Iniciar sesión con Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Usuario inició sesión:", userCredential.user.uid);
            setMessage(`¡Bienvenido de nuevo, ${userCredential.user.email}!`);
            // Aquí, más adelante, guardaríamos el estado de autenticación globalmente
            // y redirigiríamos al usuario a la página principal.

        } catch (firebaseError: any) {
            console.error("Error en Firebase Auth (Login):", firebaseError);
             if (firebaseError.code === 'auth/invalid-credential' || firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password') {
                 setError('Correo electrónico o contraseña incorrectos.');
             } else {
                 setError('Error al iniciar sesión. Intenta de nuevo.');
             }
        }
    };

    return (
        <div>
            <h2>{isRegistering ? 'Registrarse' : 'Iniciar Sesión'}</h2>

            <form onSubmit={isRegistering ? handleRegister : handleLogin}>
                {isRegistering && (
                    <>
                        <div>
                            <label>Nombre:</label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Apellidos:</label>
                            <input
                                type="text"
                                value={apellidos}
                                onChange={(e) => setApellidos(e.target.value)}
                                required
                            />
                        </div>
                    </>
                )}
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {/* Mostrar mensajes de error o éxito */}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {message && <p style={{ color: 'green' }}>{message}</p>}

                <button type="submit">
                    {isRegistering ? 'Registrarme' : 'Iniciar Sesión'}
                </button>
            </form>

            <button onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate'}
            </button>
        </div>
    );
}

export default LoginPage;