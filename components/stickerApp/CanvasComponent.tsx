import React, { forwardRef, useCallback, useContext, useRef, useState } from "react";
import { ResizeEnable, Rnd } from "react-rnd";
import { CanvasContext, ICanvasComponent } from "./CanvasContainer";
import { resizeHandleClasses } from "../../lib/utils";
import ImageElement from "./ImageElement";
import TextElement from "./TextElement";

const componentMap: { [key: string]: React.ComponentType<ICanvasComponent> } = {
  TEXT: TextElement,
  IMAGE: ImageElement
};

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

const getEnableResize = (type: string): ResizeEnable => {
  return {
    bottom: type === "IMAGE",
    bottomLeft: true,
    bottomRight: true,

    top: type === "IMAGE",
    topLeft: true,
    topRight: true,

    left: true,
    right: true
  };
};
const CanvasComponent = forwardRef((props: ICanvasComponent, ref) => {
  const { state, actions } = useContext(CanvasContext);
  const { dimension, position, content, id, type } = props;
  const [showGrids, setShowGrids] = React.useState(false);
  const [isReadOnly, setIsReadOnly] = React.useState(true);
  const elementRef = React.useRef<any>(ref);
  const isDragged = useRef<boolean>(false);
  const [emojis, setEmojis] = useState<any>([]);


  const addEmoji = (emojiSrc: string) => {
    const newEmoji = {
      id: emojis.length,
      src: emojiSrc,
      x: 50,
      y: 50,
      width: 100,
      height: 100,
    };
    setEmojis([...emojis, newEmoji]);
  };

  const updateEmoji = (index: any, updates: { x: any; y: any; }) => {
    const updatedEmojis = [...emojis];
    updatedEmojis[index] = { ...updatedEmojis[index], ...updates };
    setEmojis(updatedEmojis);
  };

  const handleReset = () => {
    // setUploadedImage(null);
    setEmojis([]);
    elementRef.current = null
  };


  const activeSelection = state?.activeSelection;

  const onBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const toolbarElement = document.querySelector("#toolbar");
    if (
      event.currentTarget.contains(event?.relatedTarget as Element) ||
      toolbarElement?.contains(event?.relatedTarget as Element)
    ) {
      return;
    }
    setIsReadOnly(true);
    actions?.setEnableQuillToolbar(false);
    if (id && activeSelection) {
      activeSelection.delete(id);
      actions?.setActiveSelection(new Set(activeSelection));
    }
  };


  const getComponent = () => {
    const Component = type && componentMap[type];
    if (!Component || !id) return null;
    return (
      <Component
        key={id}
        id={id}
        type={type}
        position={position}
        dimension={dimension}
        content={content}
        isReadOnly={isReadOnly}
      />
    );
  };

  const style: React.CSSProperties = {
    outline: "none",
    border: `2px solid ${(id && state?.activeSelection.has(id)) || showGrids || isDragged.current
        ? "#21DEE5"
        : "transparent"
      }`
  };

  const onMouseEnter = () => {
    setShowGrids(true);
  };

  const onMouseLeave = () => {
    setShowGrids(false);
  };

  const onfocus = (event: React.MouseEvent) => {
    if (id) {
      actions?.setActiveSelection(new Set(state?.activeSelection.add(id)));
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!isReadOnly) event.stopPropagation();
  };

  const handleClass =
    id && state?.activeSelection.has(id) && state?.activeSelection.size === 1
      ? "showHandles"
      : "";

  const onDoubleClick = () => {
    if (!isReadOnly) return;
    setIsReadOnly(false);
    actions?.setEnableQuillToolbar(true);
  };

  return (
    <div ref={elementRef}>
      {emojis.map((emoji: { id: any; width: any; height: any; x: any; y: any; src: string | undefined; }, index: any) => (
        <Rnd
          key={emoji.id}
          size={{ width: emoji.width, height: emoji.height }}
          position={{ x: emoji.x, y: emoji.y }}
          onDragStop={(e: any, d: { x: any; y: any; }) => updateEmoji(index, { x: d.x, y: d.y })}
          onResizeStop={(e: any, direction: any, ref: { offsetWidth: any; offsetHeight: any; }, delta: any, position: any) => updateEmoji(index, {
            width: ref.offsetWidth,
            height: ref.offsetHeight,
            ...position
          })}
          enableResizing={{
            top: true, right: true, bottom: true, left: true,
            topRight: true, bottomRight: true, bottomLeft: true, topLeft: true
          }}
        >
          <img src={emoji.src} alt={`Emoji`} style={{ width: '100%', height: '100%' }} />
        </Rnd>
      ))}
      <Rnd
        style={style}
        size={{ width: dimension?.width || 0, height: dimension?.height || 0 }}
        position={{ x: position?.left || 0, y: position?.top || 0 }}
        onDragStart={() => {
          isDragged.current = true;
        }}
        onDragStop={(e: any, d: { x: any; y: any; }) => {
          isDragged.current = false;
          actions?.updateCanvasData({ id, position: { left: d.x, top: d.y } });
        }}
        resizeHandleWrapperClass={handleClass}
        resizeHandleClasses={resizeHandleClasses}
        onResize={(e: any, direction: any, ref: { style: { width: any; height: any; }; }, delta: any, position: { y: any; x: any; }) => {
          actions?.updateCanvasData({
            id,
            dimension: { width: ref.style.width, height: ref.style.height },
            position: { top: position.y, left: position.x }
          });
        }}
        enableResizing={getEnableResize(type)}
        minWidth={100}
        minHeight={50}
        disableDragging={!isReadOnly}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onDoubleClick={onDoubleClick}
        onKeyDown={onKeyDown}
        onFocus={onfocus}
        onBlur={onBlur}
        tabIndex={0}
        lockAspectRatio={type === "IMAGE"}
      >
        <div className="item-container">{getComponent()}</div>
      </Rnd>
      {elementRef.current && (
        <div className="emoji-selector">
          {emojiList.map((emoji, index) => (
            <img key={index} src={emoji} alt={`Emoji ${index}`} onClick={() => addEmoji(emoji)} style={{ width: 50, height: 50, cursor: 'pointer', margin: 5 }} />
          ))}
        </div>
      )}
       {/* <button onClick={handleReset} style={{ margin: '10px', padding: '10px 20px', cursor: 'pointer' }}>Reset</button> */}
    </div>
  );
});

export default CanvasComponent;

// import React, { useContext, useRef, useImperativeHandle, forwardRef } from "react";
// import { ResizeEnable, Rnd } from "react-rnd";
// import { CanvasContext, ICanvasComponent } from "./CanvasContainer";
// import { resizeHandleClasses } from "../../lib/utils";
// import ImageElement from "./ImageElement";
// import TextElement from "./TextElement";

// const componentMap: { [key: string]: React.ComponentType<ICanvasComponent> } = {
//   TEXT: TextElement,
//   IMAGE: ImageElement
// };

// const getEnableResize = (type: string): ResizeEnable => {
//   return {
//     bottom: type === "IMAGE",
//     bottomLeft: true,
//     bottomRight: true,
//     top: type === "IMAGE",
//     topLeft: true,
//     topRight: true,
//     left: true,
//     right: true
//   };
// };

// const CanvasComponent = forwardRef((props: ICanvasComponent, ref) => {
//   const { dimension, position, content, id, type } = props;
//   const { state, actions } = useContext(CanvasContext);
//   const elementRef = useRef<HTMLDivElement>(null);

//   useImperativeHandle(ref, () => ({
//     getNode: () => elementRef.current
//   }));

//   const getComponent = () => {
//     const Component = type && componentMap[type];
//     if (!Component || !id) return null;
//     return <Component key={id} id={id} type={type} position={position} dimension={dimension} content={content} />;
//   };

//   const style = {
//     outline: "none",
//     border: (state?.activeSelection.has(id)) ? "2px solid #21DEE5" : "2px solid transparent"
//   };

//   return (
//     <div ref={elementRef}>
//       <Rnd
//         style={style}
//         size={{ width: dimension.width, height: dimension.height }}
//         position={{ x: position.left, y: position.top }}
//         onDragStop={(e, d) => {
//           actions.updateCanvasData({ id, position: { left: d.x, top: d.y } });
//         }}
//         onResizeStop={(e, direction, ref, delta, position) => {
//           actions.updateCanvasData({
//             id,
//             dimension: { width: parseInt(ref.style.width), height: parseInt(ref.style.height) },
//             position: { left: position.x, top: position.y }
//           });
//         }}
//         resizeHandleClasses={resizeHandleClasses}
//         enableResizing={getEnableResize(type)}
//         minWidth={100}
//         minHeight={50}
//         lockAspectRatio={type === "IMAGE"}
//       >
//         <div className="item-container">
//           {getComponent()}
//         </div>
//       </Rnd>
//     </div>
//   );
// });

// export default CanvasComponent;