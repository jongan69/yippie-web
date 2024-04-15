import React, { useContext, useRef } from "react";
import { CanvasContext, ICanvasComponent } from "./CanvasContainer";

const ImageElement = (props: ICanvasComponent) => {
  const { content, id } = props;
  const { actions } = useContext(CanvasContext);
  const uploadRef = useRef<HTMLInputElement>(null);

  const getBase64 = (file: File) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });

  const getImageDimensions = (file: string) => new Promise<{ [key: string]: number }>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.width, h: img.height, nw: img.naturalWidth, nh: img.naturalHeight });
    img.onerror = reject;
    img.src = file;
  });

  const getAdjustedDimensions = (width: number, height: number, resultWidth: number) => {
    const ratio = width / height;
    return { calcWidth: resultWidth, calcHeight: resultWidth / ratio };
  };

  const imageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await getBase64(file) as string;
        const imageDimensions = await getImageDimensions(base64);
        const { calcWidth, calcHeight } = getAdjustedDimensions(imageDimensions.nw, imageDimensions.nh, 150);
        actions?.updateCanvasData({ id, content: base64, dimension: { width: `${calcWidth}`, height: `${calcHeight}` } });
      } catch (error) {
        alert(`Error uploading image: ${error}`);
      }
    }
  };

  const triggerUpload = () => uploadRef.current?.click();

  const renderUploadContent = () => (
    <>
      <div className="image-upload-container" onClick={triggerUpload}>
        <div>Upload Image</div>
      </div>
      <input
        ref={uploadRef}
        type="file"
        id="imageFile"
        name="imageFile"
        accept="image/jpeg, image/png"
        onChange={imageUpload}
        style={{ display: 'none' }}
      />
    </>
  );

  const renderImage = () => (
    <div
      style={{
        backgroundImage: `url(${content})`,
        backgroundSize: "contain",
        width: "100%",
        height: "100%",
        backgroundRepeat: "no-repeat"
      }}
    />
  );

  return <>{!content ? renderUploadContent() : renderImage()}</>;
};

export default ImageElement;
