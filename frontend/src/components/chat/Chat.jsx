import React, { useState, useEffect, useRef } from 'react';
import './chat.css';
import './messages.css';
import { ReactComponent as Mic } from '../../svgs/mic.svg';
import { ReactComponent as Phone } from '../../svgs/phone.svg';
import { ReactComponent as Emoji } from '../../svgs/emoji.svg';
import { ReactComponent as File } from '../../svgs/file.svg';
import { ReactComponent as Info } from '../../svgs/info.svg';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { ReactComponent as Videocam } from '../../svgs/videocam.svg';
import { useDispatch, useSelector } from 'react-redux';
import MessageSection from './MessageSection';
import { v4 as uuidv4 } from 'uuid';
import { io } from 'socket.io-client';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { storage } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addPendingMessage, setMessages } from '../../redux/openChatSlice';
import { addMessageToChat } from '../../redux/chatsSlice';
import { clearNewChat } from '../../redux/newChatSlice';

const socket = io('http://localhost:5000');

function Chat() {
    const dispatch = useDispatch();
    const openChat = useSelector((state) => state.openChat.chat);
    const isTemporary = useSelector((state) => state.openChat.temporary);
    const currentUser = useSelector((state) => state.user.user);

    const receiver = openChat?.participants?.find((p) => p._id !== currentUser._id);
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState(null);
    const [fileType, setFileType] = useState('');
    const [selectedFileIndex, setSelectedFileIndex] = useState(0);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef(null);
    const emojiButtonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target) &&
                emojiButtonRef.current &&
                !emojiButtonRef.current.contains(event.target)
            ) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Receive and Send Functions 
    useEffect(() => {
        if (currentUser) {
            socket.on('connect', () => {
                console.log('Connected to Socket.IO server with ID:', socket.id);
            });

            // Join a room based on the current user's ID
            socket.emit('joinRoom', currentUser._id);

            // Listen for messages
            socket.on('receiveMessage', (msg) => {
                console.log('Message received:', msg); // Log message for debugging

                // Dispatch to add the message to the specific chat in Redux
                // When adding a message to the chat
                dispatch(addMessageToChat(msg));

                // Also update the open chat if it matches the current open chat
                const currentChatId = openChat?._id; // Get the currently open chat ID
                if (currentChatId === msg.chat) {
                    // Update the messages in the openChat slice
                    dispatch(setMessages([...openChat.messages, msg]));
                }
            });

            return () => {
                socket.off('receiveMessage'); // Cleanup the listener on unmount
            };
        }
    }, [currentUser, dispatch, openChat]); // Ensure openChat is included in the dependency array

    const sendMessage = async () => {
        if (files && files.length > 0) {
            const userId = currentUser._id;
            const tempFiles = files;
            setFiles([]); // Clear all files after sending
            setFileType([]);

            // Reset the file input after sending files
            const fileInput = document.getElementById('file-upload');
            if (fileInput) {
                fileInput.value = ''; // Reset the input value
            }

            for (const fileItem of tempFiles) {
                const fileRef = ref(storage, `chatFiles/${userId}/${uuidv4()}_${fileItem.name}`);

                try {
                    // Upload the file to Firebase Storage
                    await uploadBytes(fileRef, fileItem);
                    const fileUrl = await getDownloadURL(fileRef);

                    // Create the file object to send with the message
                    const fileObject = {
                        fileUrl,
                        fileType: fileItem.type.split('/')[0], // File type like 'image', 'video', etc.
                        fileMimeType: fileItem.type // Actual MIME type like 'image/jpeg', 'video/mp4', etc.
                    };

                    const tempId = uuidv4();
                    dispatch(addPendingMessage({
                        tempId,
                        sender: currentUser._id,
                        content: fileItem.name, // Set the filename as content or any other description
                        file: fileObject,
                        timestamp: new Date().toISOString(),
                    }));

                    // Emit the message with the file object via Socket.IO
                    socket.emit('sendMessage', {
                        tempId, // Send the tempId to track the message status
                        chatId: openChat._id, // Now sending the chatId to the backend
                        senderId: currentUser._id,
                        file: fileObject, // Send the entire file object
                        isTemporary,
                    });

                } catch (error) {
                    console.error('File upload failed:', error);
                }
            }
            if (isTemporary) {
                dispatch(clearNewChat());
            }
        } else if (message.trim()) {
            const tempId = uuidv4();
            dispatch(addPendingMessage({
                tempId,
                sender: currentUser._id,
                content: message,
                timestamp: new Date().toISOString(),
            }));

            // Emit the text message via Socket.IO
            socket.emit('sendMessage', {
                tempId, // Send the tempId to track the message status
                chatId: openChat._id, // Now sending the chatId to the backend
                senderId: currentUser._id,
                content: message,
                isTemporary,
            });

            setMessage(''); // Clear the input message after sending
        }
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker((prev) => !prev);
    };

    const handleMessageChange = (e) => {
        const target = e.target;
        target.style.height = 'auto';
        setMessage(e.target.value);
        target.style.height = `${target.scrollHeight}px`;
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files); // Convert FileList to an array
        console.log(selectedFiles);

        if (selectedFiles.length > 0) {
            setFiles(selectedFiles); // Set all selected files to state
            setFileType(selectedFiles.map(file => file.type.split('/')[0])); // Set file types for each file
        }
    };
    const handleRemoveFile = (index) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);

        // Reset the file input
        const fileInput = document.getElementById('file-upload');
        if (fileInput) {
            fileInput.value = ''; // Reset the input value
        }
    };

    // const handleFileSelection = (index) => {
    //     setSelectedFileIndex(index); // Set the selected file index
    // };

    const handleEmojiSelect = (emoji) => {
        setMessage((prev) => prev + emoji.native);
    };

    if (!openChat || !receiver) {
        return null;
    }

    return (
        <div className="chat">
            <div className="chat-header-container">
                <div className="chat-header">
                    <img src={receiver.profilePicture} alt="Profile" />
                    <div className="username-about-icons">
                        <div className="username-about">
                            <span className="username">{receiver.username}</span>
                            <p className="about">Living the life my way</p>
                        </div>
                        <div className="icons">
                            <div className="icon-container"><Phone className="icon" /></div>
                            <div className="icon-container"><Videocam className="icon" /></div>
                            <div className="icon-container"><Info className="icon" /></div>
                        </div>
                    </div>
                </div>
            </div>

            <MessageSection receiver={receiver} />

            {showEmojiPicker && (
                <div className="emoji-picker" ref={emojiPickerRef}>
                    <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                </div>
            )}

            {files && files.map((fileItem, index) => (
                <div key={index} className={`attachment-preview ${files.length > 0 ? 'preview-visible' : ''}`}>
                    <div className="attachment-details">
                        {fileItem.type.includes('image') ? (
                            <img src={URL.createObjectURL(fileItem)} alt={`Attachment Preview ${index}`} />
                        ) : fileItem.type.includes('video') ? (
                            <video width="250" controls>
                                <source src={URL.createObjectURL(fileItem)} type={fileItem.type} />
                                Your browser does not support the video tag.
                            </video>
                        ) : fileItem.type === 'application/pdf' ? (
                            <div className="pdf-preview">
                                <a href={URL.createObjectURL(fileItem)} target="_blank" rel="noopener noreferrer">
                                    <div className="pdf-icon">
                                        <PictureAsPdfIcon style={{ fontSize: '50px', color: '#d32f2f' }} />
                                    </div>
                                    <div className="file-details">
                                        <p>{fileItem.name}</p>
                                        <p>Open PDF</p>
                                    </div>
                                </a>
                            </div>
                        ) : (
                            <div className="attachment-icon">
                                <img src="/path-to-your-file-icon.svg" alt="File Icon" style={{ height: '50px' }} />
                                <p>{fileItem.name}</p>
                                <p>{(fileItem.size / 1024).toFixed(2)} KB</p>
                                <p>{fileItem.type}</p>
                            </div>
                        )}
                    </div>
                    <button className="remove-attachment" onClick={() => handleRemoveFile(index)}>
                        Remove
                    </button>
                </div>
            ))}

            <div className="chat-options">
                <div className="left-icons">
                    <button className="icon-btn" onClick={toggleEmojiPicker} ref={emojiButtonRef}>
                        <Emoji className="icon" />
                    </button>
                    <button className="icon-btn">
                        <input
                            type="file"
                            className="file-input"
                            id="file-upload"
                            multiple
                            onChange={handleFileChange}
                        />
                        <label htmlFor="file-upload" className="file-upload-label">
                            <File className="icon" />
                        </label>
                    </button>
                </div>

                <textarea
                    className="message-input"
                    placeholder="Type a message..."
                    value={message}
                    onChange={handleMessageChange}
                    onKeyDown={handleKeyDown}
                    rows="1"
                />

                <div className="right-icons">
                    <button className="icon-btn"><Mic className="icon" /></button>
                    <button className="send-btn" onClick={sendMessage}>
                        <SendRoundedIcon />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Chat;