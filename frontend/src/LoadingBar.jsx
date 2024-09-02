import React, { useEffect, useState } from 'react';
import './loadingBar.css';

function LoadingBar({ loading }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        let timer;
        if (loading) {
            setShow(true);
            timer = setTimeout(() => {
                setShow(true);
            }, 2000); // Minimum display time of 2 seconds
        } else {
            setShow(false);
        }

        return () => clearTimeout(timer);
    }, [loading]);

    if (!show) return null;

    return (
        <>
            <div className="loading-bar">
                <div className="bar"></div>
            </div>
            <div className='main-container'></div>
        </>
    );
}

export default LoadingBar;
