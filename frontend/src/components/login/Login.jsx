import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import './login.css';
import './login-responsive.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { setUser } from '../../redux/userSlice';
import Alert from '@mui/material/Alert';
import { signInWithCustomToken } from "firebase/auth";
import { auth } from '../../firebaseConfig';
import { fetchUserChats } from '../../redux/chatsSlice';

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [credential, setCredential] = useState(''); // Single field for email/username
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        const trimmedPassword = password.trim();

        if (!credential.trim() || !trimmedPassword) {
            setLoading(false);
            setError('All fields are required');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential, password: trimmedPassword }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to login');
            }

            const data = await response.json();
            const { user, token, firebaseToken } = data;
            // console.log(user);

            localStorage.setItem('ringoToken', token);
            dispatch(setUser({ ...user, token }));
            await signInWithCustomToken(auth, firebaseToken);
            dispatch(fetchUserChats(token));

            navigate('/', { replace: true });
        } catch (err) {
            setError(err.message || 'An error occurred');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page">
            <div className="left-side top">
                <div className="brand">
                    <div className="logo-container">
                        <img src="/logo.png" alt="Ringo Logo" />
                    </div>
                    <span className="welcome-text">
                        Welcome to Ringo—Where Conversations Come to Life!
                    </span>
                </div>
            </div>

            <div className="right-side bottom">
                <form className="login-form" onSubmit={handleLogin}>
                    <h2>Login to your account</h2>

                    <input
                        type="text"
                        placeholder="Email or Username"
                        className="input-field"
                        onChange={(event) => setCredential(event.target.value)}
                        value={credential}
                    />
                    <div className="password-field-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="input-field"
                            onChange={(event) => setPassword(event.target.value)}
                            value={password}
                        />
                        <span
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </span>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                        </div>
                    ) : (
                        <button type="submit" className="login-button" disabled={loading}>
                            Login
                        </button>
                    )}
                    {error && <Alert severity="error">{error}</Alert>}

                    <Link to="/reset-password" className="reset-password-link">
                        <span>Reset Password</span>
                    </Link>
                    <div className="register-link">
                        <span>Don't have an account? </span>
                        <Link to="/register">Register here</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
