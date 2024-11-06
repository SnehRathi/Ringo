import React from 'react';
import './welcomePage.css';

function WelcomePage() {
    return (
        <div className='welcome-page'>
            <div className='brand'>
                <img src='/logo.png' alt='Logo'/>
                <span className='welcome-text'>
                    Welcome to Ringo—Where Conversations Come to Life!
                </span>
            </div>
        </div>
    )
}

export default WelcomePage;