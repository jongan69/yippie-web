import React, { useState, RefObject } from 'react';
import { useDropzone } from 'react-dropzone';
import { Rnd } from 'react-rnd';
import './ImageEditor.css'; // Ensure this CSS file doesn't contain conflicting styles

interface ImageEditorProps {
    canvasRef: any;
    saveCanvas: () => void,
    // props: any
}


export const ImageEditor: React.FC<ImageEditorProps> = (props) => {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [emojis, setEmojis] = useState<any[]>([]);
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
        onDrop: (acceptedFiles: File[]) => {
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

    const saveCanvas = () => {
        if (props.canvasRef.current) {
            const link = document.createElement('a');
            link.download = 'canvas_image.png';
            link.href = props.canvasRef.current.toDataURL("image/png");
            link.click();
        }
    };

    return (
        <div className="image-editor">
            {!uploadedImage ? (
                <div {...getRootProps({ className: 'dropzone' })} style={{ height: 300, border: '2px dashed gray' }}>
                    <input {...getInputProps()} />
                    {isDragActive ? <p>Drop the image here!</p> : <p>Drag and drop an image here, or click to select an image.</p>}
                </div>
            ) : (
                <canvas ref={props.canvasRef} style={{ display: 'block', width: '100%', maxWidth: '600px', height: 'auto' }}>
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
            {uploadedImage && <button onClick={saveCanvas} style={{ margin: 10 }}>Save Image</button>}
        </div>
    );
};
