import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import './login.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { setUser } from '../../redux/user/userSlice'; // Adjust the path as necessary

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // To handle error messages

    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize useNavigate

    async function handleLogin(e) {
        e.preventDefault();
        try {
            // Send a POST request to the backend login route using fetch
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, username }),
            });

            // Check if the response is OK (status code 200-299)
            if (!response.ok) {
                throw new Error('Failed to login');
            }

            // Extract user data and token from response
            const data = await response.json();
            const { user, token } = data;
            // Saving a token
            localStorage.setItem('token', token);

            // Dispatch action to set the user in Redux store
            dispatch(setUser({ ...user, token }));

            // Clear error message
            setError('');

            // Navigate to the home route
            navigate('/');
        } catch (err) {
            // Handle error (e.g., incorrect credentials)
            setError(err.message || 'An error occurred');
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
                    <input
                        type="email"
                        placeholder="Email"
                        className="input-field"
                        onChange={(event) => setEmail(event.target.value)}
                        value={email}
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
                    <button type="submit" className="login-button">Login</button>
                    {error && <p className="error-message">{error}</p>} {/* Display error message */}
                    <div className="forgot-password">
                        <span>Forgot Password?</span>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
