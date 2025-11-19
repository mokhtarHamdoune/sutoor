"use client";

import { uploadImage } from "@/app/actions/upload";
import Editor from "@/client/features/editor";
import type { EditorContent } from "@/client/features/editor/plugins/OnChangePlugin";
import { Button } from "@/client/shared/ui/button";
import { Input } from "@/client/shared/ui/input";
import {
  ArrowLeft,
  Save,
  Trash,
  Image as ImageIcon,
  X,
  Upload,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";

interface PostEditorProps {
  post?: {
    id: string;
    slug: string;
    title: string;
    content: string; // JSON string from Lexical
    coverImage?: string | null;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  };
  onSave: (
    title: string,
    content: string,
    coverImage?: string
  ) => Promise<{ slug: string }>;
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
  const [coverImage, setCoverImage] = useState(post?.coverImage || "");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditorChange = (content: EditorContent) => {
    editorContent.current = content;
  };

  const handleSave = () => {
    if (!editorContent.current || !title.trim()) {
      alert("Please add a title and content");
      return;
    }

    startTransition(async () => {
      await onSave(title, editorContent.current!.json, coverImage || undefined);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const url = await uploadImage(formData);
      setCoverImage(url);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mt-12 min-h-dvh max-w-4xl mx-auto">
      <div className="flex justify-between mb-8">
        <Link href={cancelHref}>
          <Button variant="outline" disabled={isPending}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </Link>
        <div className="flex items-center gap-x-2">
          {post?.status === "DRAFT" && (
            <Button variant={"outline"} onClick={() => onDelete?.(post.id)}>
              <Trash className="text-destructive mr-2 h-4 w-4" /> Delete
            </Button>
          )}
          <Button onClick={handleSave} disabled={isPending || !title.trim()}>
            <Save className="mr-2 h-4 w-4" />
            {isPending ? "Saving..." : post ? "Update" : "Save"}
          </Button>
        </div>
      </div>

      {/* Cover Image Section */}
      <div className="mb-8 group relative">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageUpload}
        />

        {coverImage ? (
          <div className="relative w-full h-64 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
            <Image src={coverImage} alt="Cover" fill className="object-cover" />
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Change
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setCoverImage("")}
                disabled={isUploading}
              >
                <X className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-32 rounded-xl border-2 border-dashed border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer flex flex-col items-center justify-center text-slate-500 gap-2"
          >
            {isUploading ? (
              <div className="animate-pulse">Uploading...</div>
            ) : (
              <>
                <Upload className="h-8 w-8" />
                <span className="text-sm font-medium">Add a cover image</span>
              </>
            )}
          </div>
        )}
      </div>

      <Input
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-8 w-full h-auto text-center md:text-2xl font-extrabold border-0 border-b border-transparent focus:border-slate-200 focus-visible:ring-0 px-0 py-2 bg-transparent placeholder:text-slate-300 transition-colors shadow-none rounded-none"
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
