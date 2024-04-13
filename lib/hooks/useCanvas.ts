import React from 'react';

const useCanvas = (callback) => {
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            console.log('CANVAS:', canvas)
            const ctx = canvas.getContext('2d');
            callback([canvas, ctx]);
        }
    }, []);

    const saveAsImage = (fileName) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const link = document.createElement('a');
            link.download = fileName || 'canvas_image.png';
            link.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            link.click();
        }
    };

    return [canvasRef, saveAsImage];
};

export default useCanvas;
