"use client"
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Rnd } from 'react-rnd';
import './ImageEditor.css'; // Assuming you have some basic styles in this CSS file

export const ImageEditor = () => {
    const [uploadedImage, setUploadedImage] = useState<any>(null);
    const [emojis, setEmojis] = useState<any>([]);
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
            'image/*': "*",
        },
        onDrop: (acceptedFiles: any[]) => {
            const file = acceptedFiles[0];
            const reader = new FileReader();
            reader.onload = (e: any) => {
                setUploadedImage(e.target.result);
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
                    {
                        isDragActive ?
                            <p>Drop the image!!!</p> :
                            <p>PFP????????</p>
                    }
                </div>
            ) : (
                <div style={{ position: 'relative', width: 'auto', height: 'auto' }}>
                    <img src={uploadedImage} alt="Uploaded" style={{ display: 'block', width: '100%', maxWidth: '600px', height: 'auto' }} />
                    {emojis.map((emoji: any) => (
                        <Rnd
                            key={emoji.id}
                            size={{ width: emoji.width, height: emoji.height }}
                            position={{ x: emoji.x, y: emoji.y }}
                            onDragStop={(e: any, d: { x: any; y: any; }) => {
                                const updatedEmojis = [...emojis];
                                updatedEmojis[emoji.id] = { ...updatedEmojis[emoji.id], x: d.x, y: d.y };
                                setEmojis(updatedEmojis);
                            }}
                            onResizeStop={(e: any, direction: any, ref: { style: { width: any; height: any; }; }, delta: any, position: any) => {
                                const updatedEmojis = [...emojis];
                                updatedEmojis[emoji.id] = {
                                    ...updatedEmojis[emoji.id],
                                    width: ref.style.width,
                                    height: ref.style.height,
                                    ...position
                                };
                                setEmojis(updatedEmojis);
                            }}
                            enableResizing={{ top: true, right: true, bottom: true, left: true, topRight: true, bottomRight: true, bottomLeft: true, topLeft: true }}
                        >
                            <img src={emoji.src} alt={`Emoji`} style={{ width: '100%', height: '100%' }} />
                        </Rnd>
                    ))}
                </div>
            )}
            {uploadedImage && (
                <div className="emoji-selector">
                    {emojiList.map((emoji, index) => (
                        <img key={index} src={emoji} alt={`Emoji ${index}`} onClick={() => addEmoji(emoji)} style={{ width: 50, height: 50, cursor: 'pointer', margin: 5 }} />
                    ))}
                </div>
            )}
        </div>
    );
};
