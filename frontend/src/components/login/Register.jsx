import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice'; // Adjust the import path as necessary
import VisibilityIcon from '@mui/icons-material/Visibility'; // Assuming you're using Material-UI
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function Register() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State for password visibility
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Loading state

    const dispatch = useDispatch(); // Initialize dispatch
    const navigate = useNavigate();

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Show loader when submitting
        setError(''); // Reset any previous error messages

        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, contactNumber, username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to register');
            }

            const data = await response.json();
            console.log('Registration successful:', data);

            // Set the user state with the received data
            dispatch(setUser(data.user));

            // Hide loader and navigate to the login page
            setLoading(false);
            navigate('/');
        } catch (err) {
            setLoading(false); // Hide loader on error
            setError(err.message || 'An error occurred');
        }
    };

    return (
        <div className="register-page">
            <div className="left-side">
                <div className='brand'>
                    <img src='/logo.png' alt='Ringo Logo' />
                    <span className='welcome-text'>
                        Welcome to Ringo—Where Conversations Come to Life!
                    </span>
                </div>
            </div>
            <div className="right-side">
                <form className="register-form" onSubmit={handleSubmit}>
                    {step === 1 && (
                        <>
                            <h2>Enter Email and Phone Number</h2>
                            <div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="input-field"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    className="input-field"
                                    onChange={(e) => setContactNumber(e.target.value)}
                                    value={contactNumber}
                                />
                                <button type="button" className="next-button" onClick={nextStep}>Next</button>
                            </div>
                        </>
                    )}
                    {step === 2 && (
                        <div>
                            <h2>Choose Username and Password</h2>
                            <input
                                type="text"
                                placeholder="Username"
                                className="input-field"
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                            />
                            <div className="password-field-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="input-field"
                                    onChange={(e) => setPassword(e.target.value)}
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
                            {
                                loading ? (
                                    <div className="loading-container" >
                                        <div className="loading-spinner"></div>
                                    </div>
                                ) :
                                    <div className='prevButton-submit-Button'>
                                        <button type="button" className="prev-button" onClick={prevStep}>Back</button>
                                        <button type="submit" className="submit-button">Register</button>
                                    </div>
                            }
                        </div>
                    )}
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>
        </div>
    );
}

export default Register;
