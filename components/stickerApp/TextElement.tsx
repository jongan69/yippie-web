import React, { forwardRef, useContext, useEffect, useState } from "react";
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
  const [value, setValue] = useState('');

  useEffect(() => {
    try {
      if (actions && value) {
        actions.updateCanvasData({ id, content: value });
      } else console.log(JSON.stringify(actions))
    } catch (e) {
      alert(e)
    }
  }, [actions, value, id]);

  // const focusEditor = () => {
  //   const editor = ref?.current;
  //   if (editor) {
  //     editor.focus(); // Focus the ReactQuill editor
  //   }
  // };

  // const updateEditorValue = (value: string) => {
  //   try {
  //     if (actions) actions.updateCanvasData({ id, content: value });
  //   else alert(JSON.stringify(actions))
  // } catch (e) {
  //   alert(e)
  // }
  // };

  // const isMobile = window.innerWidth < 768; // Adjust breakpoint as necessary

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
          {/* {isMobile && <button onClick={focusEditor} style={{ marginTop: '10px' }}>Edit Text</button>} */}
        </>
      ) : (
        <>
          <ReactQuill
            readOnly={isReadOnly}
            theme="snow"
            className="quill-container"
            modules={modules}
            value={value}
            onChange={setValue}
          />
        </>
      )}
    </div>
  );
});

TextElement.displayName = 'CanvasComponent';