import { useState } from "react";
import ReactQuill from "react-quill-new";
// @ts-ignore: CSS import lacks type declarations
import "react-quill-new/dist/quill.snow.css";

export default function Editor() {
  const [value, setValue] = useState("");

  return (
    <div className="flex flex-col flex-1 min-h-0 mt-4 flex-grow scrollbar-auto">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        placeholder="Write blog..."
        className="flex flex-col flex-1 min-h-0 [&_.ql-container]:flex-1 [&_.ql-container]:min-h-0 [&_.ql-container]:overflow-y-auto [&_.ql-editor]:h-full"
      />
    </div>
  );
}


