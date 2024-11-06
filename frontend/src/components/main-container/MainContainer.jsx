import React from "react";
import Sidebar from '../sidebar/Sidebar';
import Chat from '../chat/Chat';
import WelcomePage from "./WelcomePage";
import AllUsers from "./AllUsers";
import './main-container.css';

function MainContainer({ viewMode }) {
    // const isLoading = useSelector((state) => state.loading.isLoading); // Get loading state from Redux
    // const openChat = useSelector((state) => state.openChat); // Get openChat state from Redux
    // console.log(openChat);
    // console.log(viewMode);
    // console.log(openChat);


    return (
        <div className='main-container'>
            {/* Display the LoadingBar if loading is in progress */}
            <>
                <Sidebar />
                {/* Render content based on viewMode */}

                {viewMode === 0 && <WelcomePage />}
                {viewMode === 1 && <Chat />}
                {viewMode === 2 && <AllUsers />}

            </>

        </div>
    );
}

export default MainContainer;
