import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Rnd } from 'react-rnd';
import './ImageEditor.css'; // Assuming you have some basic styles in this CSS file

const ImageEditor = () => {
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
        accept: 'image/*',
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    const addEmoji = (emojiSrc) => {
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
                            <p>Drop the image here ...</p> :
                            <p>Drag 'n' drop an image here, or click to select an image</p>
                    }
                </div>
            ) : (
                <div style={{ position: 'relative', width: 'auto', height: 'auto' }}>
                    <img src={uploadedImage} alt="Uploaded" style={{ display: 'block', width: '100%', maxWidth: '600px', height: 'auto' }} />
                    {emojis.map((emoji) => (
                        <Rnd
                            key={emoji.id}
                            size={{ width: emoji.width, height: emoji.height }}
                            position={{ x: emoji.x, y: emoji.y }}
                            onDragStop={(e, d) => {
                                const updatedEmojis = [...emojis];
                                updatedEmojis[emoji.id] = { ...updatedEmojis[emoji.id], x: d.x, y: d.y };
                                setEmojis(updatedEmojis);
                            }}
                            onResizeStop={(e, direction, ref, delta, position) => {
                                const updatedEmojis = [...emojis];
                                updatedEmojis[emoji.id] = {
                                    ...updatedEmojis[emoji.id],
                                    width: ref.style.width,
                                    height: ref.style.height,
                                    ...position
                                };
                                setEmojis(updatedEmojis);
                            }}
                            enableResizing={{ top:true, right:true, bottom:true, left:true, topRight:true, bottomRight:true, bottomLeft:true, topLeft:true }}
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

export default ImageEditor;
