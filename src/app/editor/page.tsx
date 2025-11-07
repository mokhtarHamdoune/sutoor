"use client";
import Editor from "@/client/features/editor";
import type { EditorContent } from "@/client/features/editor/plugins/OnChangePlugin";
import { Button } from "@/client/shared/ui/button";
import { Save } from "lucide-react";
import { useRef } from "react";
import { saveEditorContent } from "../editor/actions";

export default function TextEditor() {
  const editorContent = useRef<EditorContent | null>(null);

  const handleEditorChange = (content: EditorContent) => {
    editorContent.current = content;
  };

  const handleSave = async () => {
    if (!editorContent.current) return;
    await saveEditorContent(editorContent.current.json);
    // Save the editor content
  };

  return (
    <div className="w-5/12 m-auto mt-12 h-dvh">
      <div className="flex justify-end mb-4">
        <Button onClick={handleSave}>
          <Save /> Save
        </Button>
      </div>
      <Editor onChange={handleEditorChange} />
    </div>
  );
}
