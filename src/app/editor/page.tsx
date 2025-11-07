"use client";
import Editor from "@/client/features/editor";
import type { EditorContent } from "@/client/features/editor/plugins/OnChangePlugin";
import { Button } from "@/client/shared/ui/button";
import { Save } from "lucide-react";
import { useRef, useState } from "react";
import { saveEditorContent } from "../editor/actions";
import { Input } from "@/client/shared/ui/input";

export default function TextEditor() {
  const editorContent = useRef<EditorContent | null>(null);
  const [title, setTitle] = useState<string>("");

  const handleEditorChange = (content: EditorContent) => {
    editorContent.current = content;
  };

  const handleSave = async () => {
    if (!editorContent.current) return;
    await saveEditorContent(title, editorContent.current.json);
    // Save the editor content
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <div className="w-5/12 m-auto mt-12 h-dvh">
      <div className="flex justify-end mb-4">
        <Button onClick={handleSave}>
          <Save /> Save
        </Button>
      </div>
      <Input
        placeholder="Post Title"
        value={title}
        onChange={handleTitleChange}
        className="mb-4 w-full"
      />
      <Editor onChange={handleEditorChange} />
    </div>
  );
}
