import React from "react";
import './userInfo.css'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
function UserInfo() {
    const user = useSelector((state) => state.user.user);
    return (
        <div className="user-info">
            <Link to='/'>
                <div className="user">
                    <img src={user.profilePicture} />
                    <span className="username">{user.username}</span>
                </div>
            </Link>
        </div>
    )
}

export default UserInfo;