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
import styles from "./login.module.css";
import responsive from "./login-responsive.module.css";

// helper to merge CSS modules
function cx(className: string) {
    return [styles[className], responsive[className]].filter(Boolean).join(" ");
}

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch<any>(); // <--- allow async thunk dispatch
    const router = useRouter();

    async function handleLogin(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        const trimmedPassword = password.trim();

        if (!credential.trim() || !trimmedPassword) {
            setLoading(false);
            setError("All fields are required");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credential, password: trimmedPassword }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to login");
            }

            const data = await response.json();
            const { user, token, firebaseToken } = data;

            localStorage.setItem("ringoToken", token);
            dispatch(setUser({ ...user, token }));
            await signInWithCustomToken(auth, firebaseToken);

            // ✅ dispatch typed async thunk
            await dispatch(fetchUserChats(token)).unwrap();

            router.push("/");
        } catch (err: any) {
            setError(err.message || "An error occurred");
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={cx("loginPage")}>
            <div className={cx("leftSide")}>
                <div className={cx("brand")}>
                    <div className={cx("logoContainer")}>
                        <img src="/logo.png" alt="Ringo Logo" />
                    </div>
                    <span className={cx("welcomeText")}>
                        Welcome to Ringo — Where Conversations Come to Life!
                    </span>
                </div>
            </div>

            <div className={cx("rightSide")}>
                <form className={cx("loginForm")} onSubmit={handleLogin}>
                    <h2 className={cx("heading")}>Login to your account</h2>

                    <input
                        type="text"
                        placeholder="Email or Username"
                        className={cx("inputField")}
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
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
                        <button type="submit" className={cx("loginButton")} disabled={loading}>
                            Login
                        </button>
                    )}

                    {error && <Alert severity="error">{error}</Alert>}

                    <Link href="/reset-password" className={cx("resetPasswordLink")}>
                        <span>Reset Password</span>
                    </Link>

                    <div className={cx("registerLink")}>
                        <span>Don’t have an account? </span>
                        <Link href="/register">Register here</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
