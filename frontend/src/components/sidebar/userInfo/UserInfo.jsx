import React from "react";
import './userInfo.css'; // Assuming you have converted it to SCSS
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import EditIcon from '@mui/icons-material/Edit';

function UserInfo() {
    const user = useSelector((state) => state.user.user);
    // console.log(user);
    return (
        <div className="user-info">
            <Link to='/'>
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
                <EditIcon className="icon" />
            </div>
        </div>
    );
}

export default UserInfo;
