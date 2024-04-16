import React, { useRef, useEffect } from "react";

export const DrawingComponent = (props: any) => {
  const canvasRef: any = useRef(null);
  const contextRef: any = useRef(null);

  useEffect(() => {
    const canvas: any = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "#ACD3ED";
    context.lineWidth = 5;
    contextRef.current = context;
  }, []);

  const startDrawing = ({ nativeEvent }: any) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
  };

  const draw = ({ nativeEvent }: any) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={() => contextRef.current.closePath()}
      style={{ border: "2px solid #000" }}
    />
  );
};

// IN DEV BUT COULD BE BETTER: 
// import React, { useRef, useEffect } from "react";

// export const DrawingComponent = (props: any) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const contextRef = useRef<CanvasRenderingContext2D | null>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (canvas) {
//       canvas.width = canvas.offsetWidth;
//       canvas.height = canvas.offsetHeight;
//       const context = canvas.getContext("2d");
//       if (context) {
//         context.scale(2, 2); // Scale for better resolution on retina displays
//         context.lineCap = "round";
//         context.strokeStyle = "yellow";
//         context.lineWidth = 5;
//         contextRef.current = context;
//       }
//     }
//   }, []);

//   const startDrawing = (event: MouseEvent | TouchEvent) => {
//     const { offsetX, offsetY } = getOffset(event);
//     if (contextRef.current) {
//       contextRef.current.beginPath();
//       contextRef.current.moveTo(offsetX, offsetY);
//     }
//   };

//   const draw = (event: MouseEvent | TouchEvent) => {
//     const { offsetX, offsetY } = getOffset(event);
//     if (contextRef.current) {
//       contextRef.current.lineTo(offsetX, offsetY);
//       contextRef.current.stroke();
//     }
//   };

//   const getOffset = (event: MouseEvent | TouchEvent) => {
//     const rect = canvasRef.current?.getBoundingClientRect();
//     if (!rect) return { offsetX: 0, offsetY: 0 };

//     let clientX, clientY;

//     if (event instanceof MouseEvent) {
//       clientX = event.clientX;
//       clientY = event.clientY;
//     } else if (event.touches && event.touches.length > 0) {
//       clientX = event.touches[0].clientX;
//       clientY = event.touches[0].clientY;
//     } else {
//       clientX = 0;
//       clientY = 0;
//     }

//     const x = clientX - rect.left;
//     const y = clientY - rect.top;
//     return { offsetX: x, offsetY: y };
//   };

//   const handleMouseDown: React.MouseEventHandler<HTMLCanvasElement> = (event: any) => {
//     startDrawing(event);
//     canvasRef.current?.addEventListener("mousemove", draw);
//     canvasRef.current?.addEventListener("mouseup", handleMouseUp);
//   };

//   const handleTouchStart: React.TouchEventHandler<HTMLCanvasElement> = (event: any) => {
//     startDrawing(event);
//     canvasRef.current?.addEventListener("touchmove", draw);
//     canvasRef.current?.addEventListener("touchend", handleTouchEnd);
//   };

//   const handleMouseUp = () => {
//     canvasRef.current?.removeEventListener("mousemove", draw);
//     canvasRef.current?.removeEventListener("mouseup", handleMouseUp);
//     if (contextRef.current) {
//       contextRef.current.closePath();
//     }
//   };

//   const handleTouchEnd = () => {
//     canvasRef.current?.removeEventListener("touchmove", draw);
//     canvasRef.current?.removeEventListener("touchend", handleTouchEnd);
//     if (contextRef.current) {
//       contextRef.current.closePath();
//     }
//   };

//   return (
//     <canvas
//       ref={canvasRef}
//       onMouseDown={handleMouseDown}
//       onTouchStart={handleTouchStart}
//       style={{ border: "2px solid #000" }}
//     />
//   );
// };
