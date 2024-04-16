import React, { useContext } from "react";
import { CanvasContext } from "./CanvasContainer";

export const sizeList = [
  "8px",
  "9px",
  "10px",
  "11px",
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "72px"
];

export const fontList = [
  "Arial",
  "Arial Black",
  "Arial Unicode MS",
  "Calibri",
  "Cambria",
  "Cambria Math",
  "Candara",
  `Segoe UI, wf_segoe-ui_normal, helvetica, arial, sans-serif`,
  "Comic Sans MS",
  "Consolas",
  "Constantia",
  "Corbel",
  "Courier New",
  "Georgia",
  "Lucida Sans Unicode",
  "Tahoma",
  "Times New Roman",
  "Trebuchet MS",
  "Verdana"
];

interface IToolbarProps {
  isEditEnable: boolean;
  resetCanvas?: any
  isMobile?: boolean
}

export default function Toolbar({ isEditEnable, resetCanvas, isMobile }: IToolbarProps) {
  const { actions } = useContext(CanvasContext);
  const addElement = (type: string) => {
    actions?.addElement(type);
  };

  return (
    <div style={{ display: "flex" }}>
      {isEditEnable && !isMobile && (
        <div id="toolbar">
          <select className="ql-font" >
            {fontList.map((font, index) => (
              <option key={index} value={font}>{font}</option>
            ))}
          </select>
          <select className="ql-size">
            {sizeList.map((size, index) => (
              <option key={index} value={size}>{size}</option>
            ))}
          </select>
          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-underline" />
          <select className="ql-align" />
          <select className="ql-color" />
          <select className="ql-background" />
        </div>
      )}
      <div className="toolbar-item" onClick={() => addElement("TEXT")}>
        Add Text
      </div>
      <div className="toolbar-item" onClick={() => addElement("IMAGE")}>
        Add Image
      </div>
      {!isMobile && <div className="toolbar-item" onClick={() => addElement("DRAW")}>
        Draw
      </div>}
      <div className="toolbar-item" onClick={resetCanvas}>
        R
      </div>
    </div>
  );
}
