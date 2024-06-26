
import React, { useContext, useRef } from "react";
import { Rnd } from "react-rnd";
import { CanvasContext, ICanvasComponent } from "./CanvasContainer";
import { resizeHandleClasses } from "../../lib/utils";
import { ImageElement } from "./ImageElement";
import { TextElement } from "./TextElement";
import { DrawingComponent } from './DrawingComponent'

const componentMap: { [key: string]: React.ComponentType<ICanvasComponent> } = {
  TEXT: TextElement,
  IMAGE: ImageElement,
  DRAW: DrawingComponent
};

const getEnableResize = (type: string): any => {
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

const CanvasComponent = (props: ICanvasComponent) => {
  const { state, actions } = useContext(CanvasContext);
  const { isMobile, dimension, position, content, id, type } = props;
  const [showGrids, setShowGrids] = React.useState(false);
  const [isReadOnly, setIsReadOnly] = React.useState(true);
  const elementRef = React.useRef<any>(null);
  const isDragged = useRef<boolean>(false);

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
        isMobile={isMobile}
        ref={elementRef}
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

  const onfocus = () => {
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
    if (!isReadOnly || type === "DRAW") return;
    setIsReadOnly(false);
    actions?.setEnableQuillToolbar(true);
  };

  const handleClick = (event: any) => {
    if (isMobile) {
      // For mobile devices, use onGotPointerCapture
      elementRef.current?.setPointerCapture(1);
    } else {
      // For desktop, use onClick
      onDoubleClick();
    }
  };

  const onGotPointerCapture = () => {
    setIsReadOnly(false);
    if (!isReadOnly) actions?.setEnableQuillToolbar(true);
  };

  return (
    <div ref={elementRef}>
      <Rnd
        style={style}
        size={{ width: dimension?.width || 0, height: dimension?.height || 0 }}
        position={{ x: position?.left || 0, y: position?.top || 0 }}
        onDragStart={() => {
          isDragged.current = true;
        }}
        onDragStop={(_e: any, d: { x: any; y: any; }) => {
          isDragged.current = false;
          actions?.updateCanvasData({ id, position: { left: d.x, top: d.y } });
        }}
        resizeHandleWrapperClass={handleClass}
        resizeHandleClasses={resizeHandleClasses}
        onResize={(_e: any, _direction: any, ref: { style: { width: any; height: any; }; }, _delta: any, position: { y: any; x: any; }) => {
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
        onClick={handleClick} // Use onClick for desktop
        onKeyDown={onKeyDown}
        onFocus={onfocus}
        onBlur={onBlur}
        tabIndex={0}
        lockAspectRatio={type === "IMAGE" || "DRAW"}
        onGotPointerCapture={onGotPointerCapture} // Use onGotPointerCapture for mobile
      >
        <div className="item-container">{getComponent()}</div>
      </Rnd>
    </div>
  );
};

export default CanvasComponent;