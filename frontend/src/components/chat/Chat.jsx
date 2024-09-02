import React, { useState, useEffect } from 'react';
import './chat.css';
import './messages.css'
import { ReactComponent as Mic } from '../../svgs/mic.svg';
import { ReactComponent as Phone } from '../../svgs/phone.svg';
import { ReactComponent as Emoji } from '../../svgs/emoji.svg';
import { ReactComponent as File } from '../../svgs/file.svg';
import { ReactComponent as Info } from '../../svgs/info.svg';
import { ReactComponent as Videocam } from '../../svgs/videocam.svg';
// import { ReactComponent as ChatClose } from '../../svgs/chat-close.svg';

import MessageSection from './MessageSection';


function Chat() {
    return (
        <div className='chat'>
            <div className='chat-header-container'>
                <div className='chat-header'>
                    <img src='/avatar.png' />
                    <div className='username-about-icons'>
                        <div className='username-about'>
                            <span className='username'>Sneh Rathi</span>
                            <p className='about'>Living the life my way</p>
                        </div>
                        <div className='icons'>
                            <div className='icon-container'>
                                <Phone className="icon" />
                            </div>
                            <div className='icon-container'>
                                <Videocam className="icon" />
                            </div>
                            <div className='icon-container'>
                                <Info className="icon" />
                            </div>
                            {/* <div className='icon-container'>
                                <ChatClose className="icon" />
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages section */}
            <MessageSection />

            {/* Chat options */}
            <div className="chat-options">
                <div className="left-icons">
                    <button className="icon-btn">
                        <Emoji className="icon" />
                    </button>

                    <button className="icon-btn">
                        <input type="file" className="file-input" />
                        <label htmlFor="file-upload" className='file-upload-label'>
                            <File className="icon" />
                        </label>
                    </button>
                </div>

                <input type="text" className="message-input" placeholder="Type a message..." />

                <div className="right-icons">
                    <button className="icon-btn">
                    <Mic className="icon" />
                    </button>

                    <button className="send-btn">
                        <img src="/send-icon.png" alt="Send" className="icon" />
                    </button>
                </div>
            </div>
        </div>
    )
}
export default Chat;