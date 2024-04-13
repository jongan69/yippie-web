import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Rnd } from 'react-rnd';
import './ImageEditor.css'; // Ensure this CSS file doesn't contain conflicting styles

export const ImageEditor = ({ canvasRef }: any) => {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [emojis, setEmojis] = useState([]);

    const emojiList = [
        '/assets/emoji1.png',
        '/assets/emoji2.png',
        '/assets/emoji3.png',
        '/assets/emoji4.png',
        '/assets/emoji5.png',
        '/assets/emoji6.png',
        '/assets/emoji7.png',
        // Add more emoji paths as needed
    ];

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/png': ['*.png'],
            'image/jpg': ['*.jpg']
        },
        onDrop: (acceptedFiles: any[]) => {
            const file = acceptedFiles[0];
            const reader = new FileReader();
            reader.onload = (e: any) => {
                setUploadedImage(e.target.result);
            };
            reader.onerror = () => {
                console.error("Error in reading the file.");
            };
            reader.readAsDataURL(file);
        }
    });

    const addEmoji = (emojiSrc: string) => {
        const newEmoji = {
            id: emojis.length,
            src: emojiSrc,
            x: 50,  // Initial position
            y: 50,  // Initial position
            width: 100,  // Initial size
            height: 100, // Initial size
        };
        setEmojis([...emojis, newEmoji]);
    };

    return (
        <div className="image-editor">
            {!uploadedImage ? (
                <div {...getRootProps({ className: 'dropzone' })} style={{ height: 300, border: '2px dashed gray' }}>
                    <input {...getInputProps()} />
                    {isDragActive ? <p>Drop the image here!</p> : <p>Drag and drop an image here, or click to select an image.</p>}
                </div>
            ) : (
                <canvas ref={canvasRef} style={{ display: 'block', width: '100%', maxWidth: '600px', height: 'auto' }}>
                    <img src={uploadedImage} alt="Uploaded" style={{ display: 'none' }} />
                    {emojis.map((emoji: any) => (
                        <Rnd
                            key={emoji.id}
                            size={{ width: emoji.width, height: emoji.height }}
                            position={{ x: emoji.x, y: emoji.y }}
                            onDragStop={(e: any, d: { x: any; y: any; }) => {
                                const updatedEmojis = emojis.map(el => el.id === emoji.id ? { ...el, x: d.x, y: d.y } : el);
                                setEmojis(updatedEmojis);
                            }}
                            onResizeStop={(e: any, direction: any, ref: { style: { width: string; height: string; }; }, delta: any, position: any) => {
                                const updatedEmojis = emojis.map(el => el.id === emoji.id ? {
                                    ...el,
                                    width: parseInt(ref.style.width, 10),
                                    height: parseInt(ref.style.height, 10),
                                    ...position
                                } : el);
                                setEmojis(updatedEmojis);
                            }}
                            enableResizing={{
                                top: true, right: true, bottom: true, left: true,
                                topRight: true, bottomRight: true, bottomLeft: true, topLeft: true
                            }}
                        >
                            <img src={emoji.src} alt={`Emoji`} style={{ width: '100%', height: '100%' }} />
                        </Rnd>
                    ))}
                </canvas>
            )}
            <div className="emoji-selector">
                {emojiList.map((emoji, index) => (
                    <img key={index} src={emoji} alt={`Emoji ${index}`} onClick={() => addEmoji(emoji)} style={{ width: 50, height: 50, cursor: 'pointer', margin: 5 }} />
                ))}
            </div>
        </div>
    );
};
