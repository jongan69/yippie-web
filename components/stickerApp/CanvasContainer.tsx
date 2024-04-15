import React, { useCallback, useRef, useState } from "react";
import CanvasComponent from "./CanvasComponent";
import Toolbar from "./Toolbar";
import SaveButton from "./SaveButton";
import EmojiList from "./EmojiList";
import { useTheme } from "next-themes";

export const CanvasContext = React.createContext<ICanvasContext>({});

export interface ICanvasData {
  component?: string;
  id?: string;
  position?: { top: number; left: number };
  dimension?: { width: string; height: string };
  content?: string;
  type: string;
}

export interface ICanvasComponent {
  ref?: any;
  position?: { top: number; left: number };
  dimension?: { width: string; height: string };
  content?: string;
  id?: string;
  type: string;
  isReadOnly?: boolean;
}

export interface ICanvasContext {
  state?: {
    canvasData: ICanvasData[];
    activeSelection: Set<any>;
    enableQuillToolbar: boolean;
  };
  actions?: {
    setCanvasData: React.Dispatch<React.SetStateAction<ICanvasData[]>>;
    setActiveSelection: React.Dispatch<React.SetStateAction<Set<any>>>;
    updateCanvasData: (data: Partial<ICanvasComponent>) => void;
    addElement: (type: string) => void;
    setEnableQuillToolbar: (state: boolean) => void;
    resetCanvas?: () => void;
  };
}

// const getInitialData = (data: any[], type: string = "TEXT") => {
//   return {
//     type: type,
//     id: `${type}__${Date.now()}__${data.length}`,
//     position: {
//       top: 100,
//       left: 100
//     },
//     dimension: {
//       width: "150",
//       height: type === "TEXT" ? "50" : "150"
//     },
//     content: type === "TEXT" ? "Your Text" : ""
//   };
// };

const CanvasContainer = () => {
  const { theme } = useTheme()
  const canvasRef = useRef(null);
  const [canvasData, setCanvasData] = useState<any>([]);
  const [activeSelection, setActiveSelection] = useState(new Set());
  const [enableQuillToolbar, setEnableQuillToolbar] = useState(false);
  const [emojis, setEmojis] = useState([]);
  const containerRef = useRef(null);
  const isSelectAll = useRef(false);

  const updateCanvasData = useCallback((data: any) => {
    const index = canvasData.findIndex((item: any) => item.id === data.id);
    const updatedData = { ...canvasData[index], ...data };
    const newCanvasData = [...canvasData];
    newCanvasData.splice(index, 1, updatedData);
    setCanvasData(newCanvasData);
  }, [canvasData]);

  const resetCanvas = useCallback(() => {
    setEmojis([]);
    setCanvasData([]);
    setActiveSelection(new Set());
    setEnableQuillToolbar(false);
  }, []);

  const addElement = useCallback((type: string) => {
    const newElement = {
      type,
      id: `${type}__${Date.now()}__${canvasData.length}`,
      position: { top: 100, left: 100 },
      dimension: { width: "150", height: type === "TEXT" ? "50" : "150" },
      content: type === "TEXT" ? "Your Text" : ""
    };
    setCanvasData([...canvasData, newElement]);
    setActiveSelection(new Set([newElement.id]));
  }, [canvasData]);

  const deleteElement = useCallback(() => {
    const newCanvasData = canvasData.filter((item: { id: unknown; }) => !activeSelection.has(item.id));
    setCanvasData(newCanvasData);
    setActiveSelection(new Set());
  }, [canvasData, activeSelection]);

  const selectAllElement = useCallback(() => {
    const newSelection = new Set(canvasData.map((item: { id: any; }) => item.id));
    setActiveSelection(newSelection);
  }, [canvasData]);

  const handleKeyDown = useCallback((event: { key: string; ctrlKey: any; preventDefault: () => void; }) => {
    if (event.key === "Delete") {
      deleteElement();
    } else if (event.key === "a" && event.ctrlKey) {
      event.preventDefault();
      selectAllElement();
    }
  }, [deleteElement, selectAllElement]);

  const handleInteractionStart = useCallback((event: { type: string; preventDefault: () => void; }) => {
    if (event.type.startsWith('touch')) {
      event.preventDefault();
    }
    if (!isSelectAll.current) {
      setActiveSelection(new Set());
    }
  }, []);

  React.useEffect(() => {
    const interactionStart = 'ontouchend' in window ? 'touchend' : 'mousedown';
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener(interactionStart, handleInteractionStart);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener(interactionStart, handleInteractionStart);
    };
  }, [handleKeyDown, handleInteractionStart]);

  return (
    <div ref={containerRef} style={{ backgroundColor: theme === "light" ? "white" : "black" }}>
      <CanvasContext.Provider value={{
        state: { canvasData, activeSelection, enableQuillToolbar },
        actions: { setCanvasData, setActiveSelection, updateCanvasData, addElement, setEnableQuillToolbar, resetCanvas }
      }}>
        <Toolbar isEditEnable={enableQuillToolbar} resetCanvas={resetCanvas} />
        <div className="canvas-container">
          {canvasData.map((canvas: React.JSX.IntrinsicAttributes & Omit<ICanvasComponent, "ref"> & React.RefAttributes<unknown>) => (
            <CanvasComponent key={canvas.id} ref={canvasRef} {...canvas} />
          ))}
          <EmojiList emojis={emojis} setEmojis={setEmojis} />
        </div>
      </CanvasContext.Provider>
      <SaveButton elementRef={containerRef} />
    </div>
  );
};

export default CanvasContainer;