import React, { useState } from "react";

function OtherMsg({ senderName, message, file, timeSent }) {
    const [isDownloaded, setIsDownloaded] = useState(file?.isDownloaded || false); // Initialize from file object
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Function to handle file download
    const handleDownload = () => {
        if (file?.fileUrl) {
            const link = document.createElement("a");
            link.href = file.fileUrl;
            link.download = `download.${file.fileMimeType.split('/')[1]}`; // Dynamically set the filename
            link.click();
            setIsDownloaded(true); // Mark as downloaded
        }
    };

    // Function to open the image in a modal
    const openImageModal = () => {
        setIsModalOpen(true);
    };

    // Close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="other-msg">
            <div className="message-content">
                <div className="sender-name">{senderName}</div>

                {/* If there is a file (image), display the image with download functionality */}
                {file && file.fileType === 'image' && (
                    <div className="image-wrapper">
                        <img
                            src={file.fileUrl}
                            alt="Attachment"
                            className={isDownloaded ? "clear-image" : "blurred-image"}
                            onClick={isDownloaded ? openImageModal : null}
                        />
                        {!isDownloaded && (
                            <button className="download-button" onClick={handleDownload}>
                                Download
                            </button>
                        )}
                    </div>
                )}

                {/* Display the message text */}
                {message && <div className="message-text">{message}</div>}
                
                {/* Display the message timestamp */}
                <div className="message-time">{timeSent}</div>
            </div>

            {/* Modal for full image view */}
            {isModalOpen && (
                <div className="modal" onClick={closeModal}>
                    <span className="close" onClick={closeModal}>
                        &times;
                    </span>
                    <img className="modal-content" src={file.fileUrl} alt="Full view" />
                </div>
            )}
        </div>
    );
}

export default OtherMsg;