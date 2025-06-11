import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer"; // Importa tu hook de reducer global

export const Navbar = () => {
    // Obtenemos SOLO la función dispatch del store global
    const { dispatch } = useGlobalReducer();
    // No desestructuramos 'isAuthenticated' ni 'user' si no los vamos a usar condicionalmente aquí.

    const navigate = useNavigate(); // Hook para la navegación

    const handleLogout = () => {
        dispatch({ type: "logout" }); // Despacha la acción de logout
        navigate("/login"); // Redirige al usuario a la página de login después de cerrar sesión
    };

    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container">
                <Link to="/">
                    <span className="navbar-brand mb-0 h1">React Boilerplate</span>
                </Link>
                <div className="ml-auto">
                  
                    <Link to="/signup">
                        <button className="btn btn-primary me-2">Registrarse</button>
                    </Link>

                   
                    <Link to="/login">
                        <button className="btn btn-outline-primary me-2">Login</button>
                    </Link>

                   
                    <button className="btn btn-danger" onClick={handleLogout}>
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </nav>
    );
};
