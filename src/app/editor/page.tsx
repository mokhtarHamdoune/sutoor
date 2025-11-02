"use client";
import Editor from "@/client/features/editor";
import type { EditorContent } from "@/client/features/editor/plugins/OnChangePlugin";

export default function TextEditor() {
  const handleEditorChange = (content: EditorContent) => {
    console.log("HTML:", content.html);
    console.log("JSON:", content.json);
    console.log("Is Empty:", content.isEmpty);
  };

  return (
    <div className="w-1/2 m-auto mt-32 h-dvh ">
      <Editor onChange={handleEditorChange} />
    </div>
  );
}
