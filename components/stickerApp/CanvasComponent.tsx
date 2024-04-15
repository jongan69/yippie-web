"use client"
import React, { forwardRef, useContext, useRef } from "react";
import { Rnd } from "react-rnd";
import { CanvasContext, ICanvasComponent } from "./CanvasContainer";
import { resizeHandleClasses } from "../../lib/utils";
import {ImageElement} from "./ImageElement";
import {TextElement} from "./TextElement";

const componentMap: { [key: string]: React.ComponentType<ICanvasComponent> } = {
  TEXT: TextElement,
  IMAGE: ImageElement
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
  const isMobile = window.innerWidth < 768; // Adjust breakpoint as necessary
  const { state, actions } = useContext(CanvasContext);
  const { dimension, position, content, id, type } = props;
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

  const onDoubleClick = (event: { preventDefault: () => void; }) => {
    if (isMobile) {
      event.preventDefault();
    }
    if (!isReadOnly) return;
    setIsReadOnly(false);
    actions?.setEnableQuillToolbar(true);
  };

  return (
    <div ref={elementRef}>
      <Rnd
        enableUserSelectHack={false}
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
    </div>
  );
};

export default CanvasComponent;