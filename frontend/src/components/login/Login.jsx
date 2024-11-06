import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import './login.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { setUser } from '../../redux/userSlice'; // Adjust the path as necessary
import Alert from '@mui/material/Alert';
import { signInWithCustomToken } from "firebase/auth";
import { auth } from '../../firebaseConfig'; // Adjust the path as necessary

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // To handle error messages
    const [loading, setLoading] = useState(false); // To handle loader visibility

    // console.log(auth);
    // console.log(signInWithCustomToken);
    
    
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize useNavigate

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!password.trim()) {
            setLoading(false);
            setError('Password cannot be empty');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to login');
            }

            const data = await response.json();
            const { user, token, firebaseToken } = data;

            // Save MongoDB JWT token
            localStorage.setItem('ringoToken', token);
            // Dispatch the user data to Redux
            dispatch(setUser({ ...user, token }));
            console.log(user);
            
            // Authenticate using the custom token
            await signInWithCustomToken(auth, firebaseToken);

            navigate('/', { replace: true });
        } catch (err) {
            setError(err.message || 'An error occurred');
            console.error('Login error:', err); // Debug log
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page">
            <div className="left-side">
                <div className='brand'>
                    <img src='/logo.png' alt='Ringo Logo' />
                    <span className='welcome-text'>
                        Welcome to Ringo—Where Conversations Come to Life!
                    </span>
                </div>
            </div>
            <div className="right-side">
                <form className="login-form" onSubmit={handleLogin}>
                    <h2>Login to your account</h2>
                    <input
                        type="text"
                        placeholder="Username"
                        className="input-field"
                        onChange={(event) => setUsername(event.target.value)}
                        value={username}
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
                            {showPassword ? (
                                <VisibilityIcon />
                            ) : (
                                <VisibilityOffIcon />
                            )}
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
                    <div className="forgot-password">
                        <span>Forgot Password?</span>
                    </div>
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