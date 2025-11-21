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
  LayoutTemplate,
  Calendar as CalendarIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { CategorySelector } from "./components/category-selector";
import { TagInput } from "./components/tag-input";
import { Calendar } from "@/client/shared/ui/calendar";

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
  const [date, setDate] = useState<Date | undefined>(new Date());
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
    <div className="mt-8 min-h-dvh max-w-7xl mx-auto px-4 sm:px-6">
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <Link href={cancelHref}>
            <Button variant="ghost" size="sm" disabled={isPending}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="h-4 w-[1px] bg-slate-200"></div>
          <span className="text-sm text-slate-500">
            {post?.status === "PUBLISHED" ? "Published" : "Draft"}
          </span>
        </div>

        <div className="flex items-center gap-x-2">
          {post?.status === "DRAFT" && (
            <Button
              variant={"ghost"}
              className="text-slate-500 hover:text-destructive"
              onClick={() => onDelete?.(post.id)}
            >
              <Trash className="mr-2 h-4 w-4" /> Delete
            </Button>
          )}
          <Button onClick={handleSave} disabled={isPending || !title.trim()}>
            <Save className="mr-2 h-4 w-4" />
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
        {/* LEFT COLUMN: The Writing Experience */}
        <div className="max-w-3xl w-full">
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
                <Image
                  src={coverImage}
                  alt="Cover"
                  fill
                  className="object-cover"
                />
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
                className="w-full h-40 rounded-xl border-2 border-dashed border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer flex flex-col items-center justify-center text-slate-500 gap-2 group"
              >
                {isUploading ? (
                  <div className="animate-pulse">Uploading...</div>
                ) : (
                  <>
                    <div className="p-2 rounded-full bg-slate-100 group-hover:bg-slate-200 transition-colors">
                      <ImageIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-400 group-hover:text-slate-600">
                      Add cover
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          <Input
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-6 w-full h-auto text-xl md:text-4xl font-extrabold border-0 border-b border-transparent focus:border-slate-200 focus-visible:ring-0 px-0 py-2 bg-transparent placeholder:text-slate-300 transition-colors shadow-none rounded-none"
            disabled={isPending}
          />

          <div className="h-full">
            <Editor
              onChange={handleEditorChange}
              initContent={post?.content}
              editable={!isPending}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: The Settings Rail */}
        <div className="hidden lg:block">
          <div className="sticky top-8 space-y-8">
            {/* Section: Schedule */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Schedule
              </h3>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border bg-white shadow-sm"
                />
              </div>
            </div>

            {/* Section: Organization */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <LayoutTemplate className="w-4 h-4" />
                Organization
              </h3>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 space-y-6">
                <CategorySelector />
                <TagInput />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
