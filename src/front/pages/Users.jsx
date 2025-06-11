import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer"; // Asegúrate que la ruta sea correcta
import { useNavigate } from "react-router-dom"; // Para redirigir si no hay token

export const UsersList = () => {
    const { store, dispatch } = useGlobalReducer();
    const { token } = store;
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    

    useEffect(() => {
        const fetchUsers = async () => {
            // Si no hay token o no está autenticado, redirige al login
            if (!token ) {
                console.log("No autorizado: Redirigiendo al login.");
                navigate("/login");
                return;
            }

            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const response = await fetch(`${backendUrl}api/users`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                // if (!response.ok) {
                //     // Si la respuesta no es OK, registramos el error en consola
                //     const errorData = await response.json();
                //     console.error("Error al obtener usuarios:", errorData.message || response.statusText);
                    
                //     // Si es un 401, puedes seguir forzando un logout y redirigir
                //     if (response.status === 401) {
                //         dispatch({ type: "logout" });
                //         navigate("/login");
                //     }
                //     return; // Detenemos la ejecución
                // }

                const data = await response.json();
                setUsers(data); // Guardamos la lista de usuarios
            } catch (err) {
                // Errores de red o inesperados se registran en consola
                console.error("Error de red o inesperado al cargar usuarios:", err);
            }
        };

        fetchUsers();
    }, [token, navigate, dispatch]); // Dependencias del efecto

    // Eliminamos las condiciones de renderizado para loading y error.
    // Solo mostramos la tabla si hay usuarios.
    if (users.length === 0) {
        return (
            <div className="container mt-5 alert alert-info text-center" role="alert">
                No hay usuarios registrados o no se pudieron cargar.
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Usuarios Registrados</h2>
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col">#ID</th>
                        <th scope="col">Email</th>
                        <th scope="col">Nombre de Usuario</th>
                       
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.email}</td>
                            <td>{user.username}</td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};