import React, { useState } from "react";
import { Link, useNavigate,useLocation } from "react-router-dom";
import './login.css';
import Alert from '@mui/material/Alert';
import { Box, Button, Typography, TextField } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function ResetPassword() {
    const [step, setStep] = useState('generate-otp'); // 'generate-otp' or 'verify-otp'
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChangeOtp = (index, value) => {
        if (value.length <= 1 && /^[0-9]*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto-focus next field
            if (value && index < 5) {
                const nextField = document.getElementById(`otp-${index + 1}`);
                if (nextField) nextField.focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index]) {
            // Move focus to the previous field if backspace is pressed on an empty input
            if (index > 0) {
                const prevField = document.getElementById(`otp-${index - 1}`);
                if (prevField) prevField.focus();
            }
        }
    };

    async function handleGenerateOtp(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch('http://localhost:5000/reset-password/generate-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to generate OTP');
            }

            setMessage('OTP sent to your email. Please check your inbox.');
            setStep('verify-otp');
        } catch (err) {
            setError(err.message || 'An error occurred while generating OTP');
        } finally {
            setLoading(false);
        }
    }

    async function handleVerifyOtp(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch('http://localhost:5000/reset-password/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: otp.join('') }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'OTP verification failed');
            }

            setMessage('OTP verified successfully! Proceed to reset your password.');
            navigate('/reset-password/new-password', { state: { email } });
        } catch (err) {
            setError(err.message || 'An error occurred during OTP verification');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="reset-password">
            <div className="left-side">
                <div className="brand">
                    <img src="/logo.png" alt="Ringo Logo" />
                    <span className="welcome-text">
                        {step === 'generate-otp'
                            ? 'Reset Your Password to Rejoin Ringo Conversations!'
                            : 'Verify OTP to Reset Your Password!'}
                    </span>
                </div>
            </div>
            <div className="right-side">
                {step === 'generate-otp' ? (
                    <form className="reset-password-form" onSubmit={handleGenerateOtp}>
                        <h2>Reset Password</h2>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="input-field"
                            onChange={(event) => setEmail(event.target.value)}
                            value={email}
                            required
                        />
                        {loading ? (
                            <div className="loading-container">
                                <div className="loading-spinner"></div>
                            </div>
                        ) : (
                            <button type="submit" className="login-button" disabled={loading}>
                                Send OTP
                            </button>
                        )}
                        {message && <Alert severity="success">{message}</Alert>}
                        {error && <Alert severity="error">{error}</Alert>}
                        <div className="register-link">
                            <span>Remembered your password? </span>
                            <Link to="/login">Login here</Link>
                        </div>
                    </form>
                ) : (
                    <form className="verify-otp-form" onSubmit={handleVerifyOtp}>
                        <Typography variant="h4" gutterBottom color="white">
                            Verify OTP
                        </Typography>
                        <Box display="flex" justifyContent="center" gap={1} my={2}>
                            {otp.map((digit, index) => (
                                <TextField
                                    key={index}
                                    id={`otp-${index}`}
                                    value={digit}
                                    onChange={(e) => handleChangeOtp(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    inputProps={{
                                        maxLength: 1,
                                        style: {
                                            textAlign: 'center',
                                            fontSize: '18px',
                                            width: '30px',
                                            height: '30px',
                                        },
                                    }}
                                    variant="outlined"
                                />
                            ))}
                        </Box>
                        {loading ? (
                            <div className="loading-container">
                                <div className="loading-spinner"></div>
                            </div>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                fullWidth
                                disabled={otp.some((digit) => !digit) || loading}
                            >
                                Verify OTP
                            </Button>
                        )}
                        {message && <Alert severity="success" style={{ marginTop: '10px' }}>{message}</Alert>}
                        {error && <Alert severity="error" style={{ marginTop: '10px' }}>{error}</Alert>}
                        <Box mt={2}>
                            <Typography variant="body2" color="white">
                                Didn’t receive the OTP?{' '}
                                <Button onClick={() => console.log('Resend OTP')} color="primary">
                                    Resend OTP
                                </Button>
                            </Typography>
                            <Typography variant="body2">
                                <Link to="#" onClick={() => setStep('generate-otp')} className="go-back-to-otp">
                                    Go back to Generate OTP
                                </Link>
                            </Typography>
                        </Box>
                    </form>
                )}
            </div>
        </div>
    );
}

function NewPassword() {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email; // Get email from the navigation state

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        console.log(password);
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/reset-password/new-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword: password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to reset password');
            }

            setMessage('Password reset successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 3000); // Redirect to login after success
        } catch (err) {
            setError(err.message || 'An error occurred while resetting the password');
            console.error('Password reset error:', err);
        } finally {
            setLoading(false);
        }
    }

    if (!email) {
        return (
            <div className="reset-password">
                <h2>Email not provided</h2>
                <p>Please go back and try again.</p>
            </div>
        );
    }

    return (
        <div className="reset-password">
            <div className="left-side">
                <div className='brand'>
                    <img src='/logo.png' alt='Ringo Logo' />
                    <span className='welcome-text'>
                        Reset Your Password
                    </span>
                </div>
            </div>
            <div className="right-side">
                <form className="reset-password-form" onSubmit={handleSubmit}>
                    <h2>Set New Password</h2>

                    {/* Password Input */}
                    <div className="password-field-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="New Password"
                            className="input-field"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                        />
                        <span
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </span>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="password-field-container">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            className="input-field"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            value={confirmPassword}
                            required
                        />
                        <span
                            className="toggle-password"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </span>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                        </div>
                    ) : (
                        <button type="submit" className="login-button" disabled={loading}>
                            Reset Password
                        </button>
                    )}
                    {message && <Alert severity="success">{message}</Alert>}
                    {error && <Alert severity="error">{error}</Alert>}
                </form>
            </div>
        </div>
    );
}

export {NewPassword};
export default ResetPassword;