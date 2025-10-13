"use client";

import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import styles from "./sidebar.module.css";

import { logout } from "../../redux/userSlice"; // Adjust path
import { clearOpenChat } from "../../redux/openChatSlice";
import { clearChats } from "@/redux/chatsSlice";

import { auth } from "../../firebaseConfig"; // Firebase config
import { signOut } from "firebase/auth";

import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import { Box } from "@mui/material";
import Link from "next/link";

export default function UserInfo() {
    const user = useSelector((state: any) => state.user.user);
    const dispatch = useDispatch();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const settingsButtonRef = useRef<HTMLDivElement>(null);

    // Logout handler
    const handleLogout = async () => {
        try {
            await signOut(auth);

            dispatch(logout());
            dispatch(clearChats());
            dispatch(clearOpenChat());

            router.replace("/login");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setOpen(false);
        }
    };

    // Edit profile handler
    const handleEditProfile = () => {
        // Add edit logic here
        setOpen(false);
    };

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const clickedOutsideDropdown = !dropdownRef.current?.contains(
                event.target as Node
            );
            const clickedOutsideButton = !settingsButtonRef.current?.contains(
                event.target as Node
            );

            if (clickedOutsideDropdown && clickedOutsideButton) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleOpenDropdown = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setOpen((prev) => !prev);
    };

    const handleClearOpenChat = () => {
        dispatch(clearOpenChat());
    };

    return (
        <div className={styles.userInfo}>
            <Link href="/" onClick={handleClearOpenChat}>
                <div className={styles.user}>
                    <img src={user?.profilePicture} alt="Profile" />
                    <span className={styles.username}>{user?.username}</span>
                </div>
            </Link>

            <div className={styles.icons}>
                <Link href="/user/allUsers">
                    <PersonAddAlt1Icon className={styles.icon} />
                </Link>
                <GroupAddIcon className={styles.icon} />
                <div ref={settingsButtonRef} onClick={handleOpenDropdown}>
                    <SettingsIcon className={styles.icon} />
                </div>
            </div>

            {open && (
                <div ref={dropdownRef} className={styles.dropdownMenu}>
                    <Box className={styles.modalBox}>
                        <h3>Settings</h3>
                        <button
                            className={styles.dropdownButton}
                            onClick={handleEditProfile}
                        >
                            <span>Edit Profile</span>
                            <EditIcon className={styles.dropdownIcon} />
                        </button>
                        <button
                            className={`${styles.dropdownButton} ${styles.logout}`}
                            onClick={handleLogout}
                        >
                            <span>Logout</span>
                            <LogoutIcon className={styles.dropdownIcon} />
                        </button>
                    </Box>
                </div>
            )}
        </div>
    );
}
