import React, { useContext, useEffect, useRef } from "react";
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

const TextElement = (props: ICanvasComponent) => {
  const { content, id, isReadOnly } = props;
  const { actions } = useContext(CanvasContext);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getEditor().on('selection-change', function (range: any) {
        if (range) {
          editorRef.current.focus();
        }
      });
    }
  }, []);

  const focusEditor = () => {
    const editor = editorRef.current;
    if (editor) {
      editor.focus(); // Focus the ReactQuill editor
    }
  };

  const updateEditorValue = (value: string) => {
    try {
      if (actions) actions.updateCanvasData({ id, content: value });
    } catch (e) {
      alert(e)
    }
  };

  const isMobile = window.innerWidth < 768; // Adjust breakpoint as necessary

  const modules = {
    toolbar: isMobile ? [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['clean']
    ] : "#toolbar"
  };

  return (
    <div>
      {isReadOnly ? (
        <>
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
          {/* <button onClick={focusEditor} style={{ padding: '10px' }}>Edit Text</button> */}
        </>
      ) : (
        <>
          <ReactQuill
            ref={editorRef}
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
};

export default TextElement;