import React, { useState, useRef, useEffect } from "react";
import './userInfo.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/userSlice'; // Adjust path
import { clearOpenChat } from '../../../redux/openChatSlice'; // Adjust path
import { auth } from '../../../firebaseConfig'; // Firebase config
import { signOut } from "firebase/auth"; // Firebase signOut method
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import { Box } from '@mui/material';

function UserInfo() {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null); // Reference to the dropdown
    const settingsButtonRef = useRef(null); // Create a reference for the settings button

    const handleOpen = () => setOpen(!open); // Toggle the dropdown

    const handleLogout = async () => {
        try {
            // Sign out from Firebase
            await signOut(auth);

            // Clear Redux store and localStorage
            dispatch(logout());
            dispatch(clearOpenChat());

            // Redirect to login page
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setOpen(false);
        }
    };

    const handleEditProfile = () => {
        // Handle profile edit logic
        setOpen(false);
    };

    // Close the dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the click is outside both the dropdown and the settings button
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                settingsButtonRef.current &&
                !settingsButtonRef.current.contains(event.target)
            ) {
                setOpen(false); // Close dropdown if clicked outside
            }
        };

        // Add event listener to detect clicks outside the dropdown
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const handleClearOpenChat = () => {
        dispatch(clearOpenChat()); // Dispatch the action to clear open chat
    };

    return (
        <div className="user-info">
            <Link to='/' onClick={handleClearOpenChat}>
                <div className="user">
                    <img src={user.profilePicture} alt="Profile" />
                    <span className="username">{user.username}</span>
                </div>
            </Link>
            <div className="icons">
                <Link to='/user/allUsers'>
                    <PersonAddAlt1Icon className="icon" />
                </Link>
                <GroupAddIcon className="icon" />
                <SettingsIcon className="icon" onClick={handleOpen} />
            </div>
            {/* Dropdown Settings */}
            {open && (
                <div ref={dropdownRef} className="dropdown-menu">
                    <Box className="modal-box">
                        <h3>Settings</h3>
                        <button className="dropdown-button" onClick={handleEditProfile}>
                            <span>Edit Profile</span>
                            <EditIcon className="dropdown-icon" />
                        </button>
                        <button className="dropdown-button logout" onClick={handleLogout}>
                            <span>Logout</span>
                            <LogoutIcon className="dropdown-icon" />
                        </button>
                    </Box>
                </div>
            )}
        </div>
    );
}

export default UserInfo;
