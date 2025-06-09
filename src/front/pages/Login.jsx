import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";


export const Login = () => {
    const { isAuthenticated, message, login, clearMessage } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/welcome");
        }
    }, [isAuthenticated]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validate form
        if (!email || !password) {
            setError("Email and password are required");
            return;
        }

        // Try to log in
        const success = await login(email, password);
        if (success) {
            navigate("/welcome");
        }
    };

    return (
        <div className="container">
            <div className="auth-form">
                <h2>Login</h2>

                {message && (
                    <div className="alert alert-info" role="alert">
                        {message}
                        <button
                            type="button"
                            className="btn-close float-end"
                            onClick={clearMessage}
                        />
                    </div>
                )}

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
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </div>
            </div>
        </div>
    );
};