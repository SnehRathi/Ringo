import React from 'react';
import PropTypes from 'prop-types';
import ChatIcon from '@mui/icons-material/Chat';

function AddUserItem({ user, handleMessage }) {
    
    // console.log(user);
    
    return (
        <div className='user-item'>
            <img src={user.profilePicture} alt={user.username} className='profile-pic' />
            <span className='username'>{user.username}</span>
            <div className='user-actions'>
                <button onClick={() => handleMessage(user._id)} className='action-btn'>Chat <ChatIcon /></button>
            </div>
        </div>
    );
}

// Define prop types for the component
AddUserItem.propTypes = {
    user: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        profilePicture: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
    }).isRequired,
    handleMessage: PropTypes.func.isRequired,
};

export default AddUserItem;
