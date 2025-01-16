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
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { storage } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addMessageToChatForSender } from '../../redux/chatsSlice';
import { clearNewChat } from '../../redux/newChatSlice';

function Chat({ socket }) {
    const dispatch = useDispatch();
    const openChat = useSelector((state) => state.openChat.chat);
    const currentUser = useSelector((state) => state.user.user);
    const receiver = openChat?.participants?.find((p) => p._id !== currentUser._id);
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef(null);
    const emojiButtonRef = useRef(null);

    // Handle clicking outside the emoji picker
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
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle sending messages
    const sendMessage = async () => {
        if (!socket) {
            console.error("Socket is not connected");
            return;
        }

        const tempId = uuidv4();
        const isTemporary = !openChat._id;

        if (files.length > 0) {
            const userId = currentUser._id;
            const tempFiles = [...files];
            setFiles([]); // Clear files after initiating upload

            for (const fileItem of tempFiles) {
                const fileRef = ref(storage, `chatFiles/${userId}/${uuidv4()}_${fileItem.name}`);
                try {
                    await uploadBytes(fileRef, fileItem);
                    const fileUrl = await getDownloadURL(fileRef);

                    const fileObject = {
                        fileUrl,
                        fileType: fileItem.type.split('/')[0],
                        fileMimeType: fileItem.type,
                    };

                    const newMessage = {
                        tempId,
                        chat: openChat._id,
                        sender: currentUser._id,
                        content: fileItem.name,
                        file: fileObject,
                        timestamp: new Date().toISOString(),
                        status: 'sent',
                    };

                    // Add message locally to the sender's open chat area
                    dispatch(addMessageToChatForSender({ message: newMessage, currentUserId: currentUser._id }));

                    // Emit message to the server
                    socket.emit('sendMessage', {
                        tempId,
                        chatId: openChat._id,
                        senderId: currentUser._id,
                        file: fileObject,
                        content: fileItem.name,
                        isTemporary,
                    });
                } catch (error) {
                    console.error('File upload failed:', error);
                }
            }

            if (isTemporary) dispatch(clearNewChat());
        } else if (message.trim()) {
            const newMessage = {
                tempId,
                chat: openChat._id,
                sender: currentUser._id,
                content: message,
                timestamp: new Date().toISOString(),
                status: 'sending',
            };

            console.log(newMessage)
            // Add message locally to the sender's open chat area
            dispatch(addMessageToChatForSender({ message: newMessage, currentUserId: currentUser._id }));

            // Emit message to the server
            socket.emit('sendMessage', {
                tempId,
                chatId: openChat._id,
                senderId: currentUser._id,
                content: message,
                isTemporary,
            });

            setMessage('');
        }
    };

    const toggleEmojiPicker = () => setShowEmojiPicker((prev) => !prev);

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
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length > 0) {
            setFiles(selectedFiles);
        }
    };

    const handleRemoveFile = (index) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
    };

    const handleEmojiSelect = (emoji) => setMessage((prev) => prev + emoji.native);

    if (!openChat || !receiver) return null;

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

            {files.map((fileItem, index) => (
                <div key={index} className="attachment-preview">
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
