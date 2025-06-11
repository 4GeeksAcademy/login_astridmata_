import React, { useState } from "react"; // No necesitamos useEffect ni useGlobalReducer para isAuthenticated, message, authError aquí
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer"; // Seguimos importando para el dispatch

export const Login = () => {
    // Solo necesitamos 'dispatch' para enviar la acción 'login_success'
    const { dispatch } = useGlobalReducer();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones básicas del formulario (sin estado local de error adicional por ahora)
        if (!email || !password) {
            alert("El email y la contraseña son requeridos."); // Usamos alert para simplicidad
            return;
        }

        try {
           

            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${backendUrl}api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json(); // Asumimos que siempre devuelve JSON

            if (!response.ok) {
                // Si la respuesta no es OK (ej. 400, 401, 500)
                alert(data.message || "Credenciales inválidas o error de servidor.");
                return; // Detiene la ejecución si hay un error
            }

            // Si el login es exitoso, despacha la acción 'login_success'
            // Es CRUCIAL que 'data' contenga 'token' y 'user' aquí para que el reducer lo guarde.
            dispatch({
                type: "login_success",
                payload: {
                    token: data.token, // Tu backend debe enviar esto
                    user: data.user,   // Tu backend debe enviar esto (ej. { id: 1, email: "user@example.com" })
                }
            });

            navigate("/users"); // Navega a la página de bienvenida

        } catch (error) {
            console.error("Error de login (red o servidor caído):", error);
            alert("Ocurrió un error inesperado al intentar iniciar sesión. Intenta de nuevo."); // Mensaje más genérico
        }
    };

    return (
        <div className="container">
            <div className="auth-form">
                <h2>Login</h2>

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

                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary">
                            Login
                        </button>
                    </div>
                </form>

                <div className="text-center mt-3">
                    ¿No tienes una cuenta? <Link to="/signup">Regístrate</Link>
                </div>
            </div>
        </div>
    );
};