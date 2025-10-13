"use client";

import { useState, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Alert from "@mui/material/Alert";
import { signInWithCustomToken } from "firebase/auth";

import { setUser } from "@/redux/userSlice";
import { fetchUserChats } from "@/redux/chatsSlice";
import { auth } from "@/firebaseConfig";
import styles from "./register.module.css";
import responsive from "./register-responsive.module.css";

function cx(className: string) {
    return [styles[className], responsive[className]].filter(Boolean).join(" ");
}

export default function RegisterForm() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch<any>();
    const router = useRouter();

    /** ✅ Basic validators */
    const validateEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validatePhone = (phone: string) =>
        /^[0-9]{10}$/.test(phone); // 10 digit numeric

    const validateUsername = (uname: string) =>
        uname.length >= 3 && /^[a-zA-Z0-9_]+$/.test(uname);

    const validatePassword = (pass: string) =>
        pass.length >= 6; // you can add more complexity if needed

    const nextStep = () => {
        if (!email.trim() || !contactNumber.trim()) {
            setError("Please enter both email and phone number");
            return;
        }
        if (!validateEmail(email.trim())) {
            setError("Please enter a valid email address");
            return;
        }
        if (!validatePhone(contactNumber.trim())) {
            setError("Phone number must be 10 digits");
            return;
        }
        setError("");
        setStep(2);
    };

    const prevStep = () => setStep(1);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");

        // ✅ Step 2 field checks
        if (!username.trim() || !password.trim()) {
            setError("Username and password are required");
            return;
        }
        if (!validateUsername(username.trim())) {
            setError(
                "Username must be at least 3 characters and contain only letters, numbers, or underscores"
            );
            return;
        }
        if (!validatePassword(password.trim())) {
            setError("Password must be at least 6 characters long");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.trim(),
                    contactNumber: contactNumber.trim(),
                    username: username.trim(),
                    password: password.trim(),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to register");
            }

            const data = await response.json();
            const { user, token, firebaseToken } = data;

            localStorage.setItem("ringoToken", token);
            dispatch(setUser({ ...user, token }));

            await signInWithCustomToken(auth, firebaseToken);
            await dispatch(fetchUserChats(token)).unwrap();

            router.push("/");
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={cx("registerPage")}>
            <div className={cx("leftSide")}>
                <div className={cx("brand")}>
                    <div className={cx("logoContainer")}>
                        <img src="/logo.png" alt="Ringo Logo" />
                    </div>
                    <span className={cx("welcomeText")}>
                        Join Ringo — Let’s Get You Started!
                    </span>
                </div>
            </div>

            <div className={cx("rightSide")}>
                <form className={cx("registerForm")} onSubmit={handleSubmit}>
                    {step === 1 && (
                        <>
                            <h2 className={cx("heading")}>Enter Email and Phone Number</h2>
                            <input
                                type="email"
                                placeholder="Email"
                                className={cx("inputField")}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                className={cx("inputField")}
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                            />
                            <button
                                type="button"
                                className={cx("loginButton")}
                                onClick={nextStep}
                            >
                                Next
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h2 className={cx("heading")}>Choose Username and Password</h2>
                            <input
                                type="text"
                                placeholder="Username"
                                className={cx("inputField")}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <div className={cx("passwordFieldContainer")}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className={cx("passwordField")}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span
                                    className={cx("togglePassword")}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </span>
                            </div>

                            {loading ? (
                                <div className={cx("loadingContainer")}>
                                    <div className={cx("loadingSpinner")}></div>
                                </div>
                            ) : (
                                <div className={cx("buttonRow")}>
                                    <button
                                        type="button"
                                        className={cx("prevButton")}
                                        onClick={prevStep}
                                    >
                                        Back
                                    </button>
                                    <button type="submit" className={cx("loginButton")}>
                                        Register
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {/* ✅ Always visible login link */}
                    <div className={cx("loginRedirect")}>
                        Already have an account? <Link href="/login">Login</Link>
                    </div>

                    {error && <Alert severity="error">{error}</Alert>}
                </form>
            </div>
        </div>
    );
}
