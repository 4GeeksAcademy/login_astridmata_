import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Signup = () => {
    // const { isAuthenticated, message, isLoading, signup, clearMessage } = useAuth();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
   
    const [error, setError] = useState("");
    const navigate = useNavigate();

    
    const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpia cualquier error previo

    // // Agrega validación para el username también, si aún no lo has hecho en las validaciones iniciales
    // if (!email || !username || !password || !confirmPassword) { // Asegúrate de que 'username' esté en tus estados de React
    //     setError("Todos los campos son requeridos");
    //     return;
    // }

    // if (password !== confirmPassword) {
    //     setError("Las contraseñas no coinciden");
    //     return;
    // }

    if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres");
        return;
    }

    try {
        dispatch({ type: "auth_loading" }); // Activa el estado de carga (asumiendo que 'dispatch' viene de useAuth/useGlobalReducer)

        const backendUrl = import.meta.env.VITE_BACKEND_URL; // Obtiene la URL base de tu backend
        const response = await fetch(`${backendUrl}/signup`, { // Asegúrate que la ruta sea '/signup' y no '/api/signup' si tu backend lo define directamente
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // ¡Aquí es donde agregamos el 'username' al cuerpo de la solicitud!
            body: JSON.stringify({ email, username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Si la respuesta no es OK (ej. 400, 409, 500), maneja el error
            // Asume que el backend devuelve un objeto JSON con una propiedad 'message' para los errores
            throw new Error(data.message || "Algo salió mal durante el registro.");
        }

        // Si el registro es exitoso, navega a la página de login
        navigate("/login");

    } catch (error) {
        console.error("Error de registro:", error);
        setError(error.message || "Ocurrió un error inesperado durante el registro.");
        dispatch({ type: "auth_error", payload: error.message }); // Actualiza el estado global de error
    }
};

    return (
        <div className="container">
            <div className="auth-form">
                <h2>Sign Up</h2>

                {/* {message && (
                    <div className="alert alert-info" role="alert">
                        {message}
                        <button
                            type="button"
                            className="btn-close float-end"
                            onClick={clearMessage}
                        />
                    </div>
                )} */}

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                        <button
                            type="button"
                            className="btn-close float-end"
                            onClick={() => setError("")}
                        />
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        // disabled={isLoading}
                    >
                        {/* {isLoading ? "Loading..." : "Sign Up"} */}
                    </button>
                </form>

                <div className="mt-3 text-center">
                    <p>
                        Already have an account? <Link to="/login">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};