import React from "react";
import Sidebar from '../sidebar/Sidebar';
import Chat from '../chat/Chat';
import WelcomePage from "../welcome-page/WelcomePage";
import LoadingBar from "../../LoadingBar"; // Import the LoadingBar component
import { useSelector } from 'react-redux';
import './main-container.css';

function MainContainer({ isChatOpen }) {
    const isLoading = useSelector((state) => state.loading.isLoading); // Get loading state from Redux

    return (
        <div className='main-container'>
            {/* Display the LoadingBar if loading is in progress */}
            {isLoading ? <LoadingBar loading={isLoading} /> : (
                <>
                    <Sidebar />
                    {isChatOpen ? <Chat /> : <WelcomePage />}
                </>
            )}
        </div>
    );
}

export default MainContainer;
