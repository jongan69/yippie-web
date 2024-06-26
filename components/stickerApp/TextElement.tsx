import React, { forwardRef, useContext } from "react";
import dynamic from "next/dynamic";
import ReactHtmlParser from "react-html-parser";
import "react-quill/dist/quill.snow.css";
import { CanvasContext, ICanvasComponent } from "./CanvasContainer";
import { fontList, sizeList } from "./Toolbar";

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading...</p>
}) as any;

const Quill = typeof window === 'object' ? require('react-quill').Quill : () => false;

if (Quill) {
  const Size = Quill.import("attributors/style/size");
  Size.whitelist = sizeList;
  const Font = Quill.import("attributors/style/font");
  Font.whitelist = fontList;
  Quill.register({ 'formats/size': Size, 'formats/font': Font }, true);
}

export const TextElement = forwardRef((props: ICanvasComponent, ref: any) => {
  const { isMobile, content, id, isReadOnly } = props;
  const { actions } = useContext(CanvasContext);

  const updateEditorValue = (value: string) => {
    actions?.updateCanvasData({ id, content: value });
  };

  const modules = {
    toolbar: isMobile ? [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['clean']
    ] : "#toolbar"
  };

  return (
    <div ref={ref}>
      {isReadOnly ? (
        <div
          className="ql-editor"
          style={{
            fontFamily: "Arial",
            fontSize: "13px",
            padding: 0
          }}
        >
          {ReactHtmlParser(content || "")}
        </div>
      ) : (
        <>
          <ReactQuill
            readOnly={isReadOnly}
            theme="snow"
            className="quill-container"
            modules={modules}
            value={content}
            onChange={updateEditorValue}
          />
        </>
      )}
    </div>
  );
});

TextElement.displayName = 'CanvasComponent';