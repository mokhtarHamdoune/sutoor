"use client";

import Editor from "@/client/features/editor";
import type { EditorContent } from "@/client/features/editor/plugins/OnChangePlugin";
import { Button } from "@/client/shared/ui/button";
import { Input } from "@/client/shared/ui/input";
import { ArrowLeft, Save, Trash } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useTransition } from "react";

interface PostEditorProps {
  post?: {
    id: string;
    slug: string;
    title: string;
    content: string; // JSON string from Lexical
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  };
  onSave: (title: string, content: string) => Promise<{ slug: string }>;
  onDelete?: (id: string) => Promise<void>;
  cancelHref: string;
}

export default function PostEditor({
  post,
  onSave,
  onDelete,
  cancelHref,
}: PostEditorProps) {
  const [isPending, startTransition] = useTransition();
  const editorContent = useRef<EditorContent | null>(null);
  const [title, setTitle] = useState(post?.title || "");

  const handleEditorChange = (content: EditorContent) => {
    editorContent.current = content;
  };

  const handleSave = () => {
    if (!editorContent.current || !title.trim()) {
      alert("Please add a title and content");
      return;
    }

    startTransition(async () => {
      await onSave(title, editorContent.current!.json);
    });
  };

  return (
    <div className="mt-12 min-h-dvh">
      <div className="flex justify-between mb-4">
        <Link href={cancelHref}>
          <Button variant="outline" disabled={isPending}>
            <ArrowLeft />
            Cancel
          </Button>
        </Link>
        <div className="flex items-center gap-x-2">
          {post?.status === "DRAFT" && (
            <Button variant={"outline"} onClick={() => onDelete?.(post.id)}>
              <Trash className="text-destructive" /> Delete
            </Button>
          )}
          <Button onClick={handleSave} disabled={isPending || !title.trim()}>
            <Save />
            {isPending ? "Saving..." : post ? "Update" : "Save"}
          </Button>
        </div>
      </div>

      <Input
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-4 w-full text-3xl font-bold border-0 focus-visible:ring-0"
        disabled={isPending}
      />

      <Editor
        onChange={handleEditorChange}
        initContent={post?.content}
        editable={!isPending}
      />
    </div>
  );
}
