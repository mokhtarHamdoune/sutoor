"use client";

import { uploadImage } from "@/app/actions/upload";
import { Button } from "@/client/shared/ui/button";
import { Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

interface ImageDropzoneProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  disabled?: boolean;
}

export function ImageDropzone({ value, onChange, disabled }: ImageDropzoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const url = await uploadImage(formData);
      onChange(url);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-8 group relative">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleImageUpload}
        disabled={disabled || isUploading}
      />

      {value ? (
        <div className="relative w-full h-64 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
          <Image
            src={value}
            alt="Cover"
            fill
            className="object-cover"
          />
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading}
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Change
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onChange(null)}
              disabled={disabled || isUploading}
            >
              <X className="mr-2 h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          className={`w-full h-40 rounded-xl border-2 border-dashed border-slate-200 transition-all flex flex-col items-center justify-center text-slate-500 gap-2 group ${
            !disabled && !isUploading ? "hover:border-slate-400 hover:bg-slate-50 cursor-pointer" : "cursor-not-allowed opacity-60"
          }`}
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
  );
}
