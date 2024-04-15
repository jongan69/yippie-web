import React from 'react';
import html2canvas from 'html2canvas';

const SaveButton = ({ elementRef }: any) => {
  const saveAsImage = () => {
    console.log(elementRef)
    const element = elementRef.current
    if (element) {
      console.log(element)
      html2canvas(element).then((canvas) => {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.download = 'canvas-image.png';
        link.href = image;
        link.click();
      });
    }
  };

  return (
    <button onClick={saveAsImage}>Save Image</button>
  );
};

export default SaveButton;
