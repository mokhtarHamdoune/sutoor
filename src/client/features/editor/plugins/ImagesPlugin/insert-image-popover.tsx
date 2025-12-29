import { useEffect, useRef, useState } from "react";
import { InsertImagePayload } from "./index";
import { Button } from "@/client/shared/ui/button";
import { Input } from "@/client/shared/ui/input";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/client/shared/ui/tabs";
import { FolderOpen, CirclePlus, Link } from "lucide-react";
import { uploadImage } from "@/app/actions/upload";

interface InsertImagePopoverProps {
  position: { top: number; left: number };
  onInsert: (payload: InsertImagePayload) => void;
  onClose: () => void;
}

const InsertImagePopover = ({
  position,
  onInsert,
  onClose,
}: InsertImagePopoverProps) => {
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    // Add event listener with a small delay to avoid immediate close
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleUrlSubmit = () => {
    if (url.trim()) {
      onInsert({
        src: url,
        altText: "image",
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const uploadedUrl = await uploadImage(formData);

        onInsert({
          src: uploadedUrl,
          altText: file.name,
        });
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("Failed to upload image. Please try again.");
      } finally {
        setUploading(false);
      }
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      ref={popoverRef}
      className="fixed z-[1000] w-100 bg-white rounded-lg border border-gray-200 shadow-lg p-4"
      style={{
        // Position above the cursor line with 8px gap
        top: `${
          position.top - (popoverRef.current?.offsetHeight || 150) - 4
        }px`,
        left: `${position.left}px`,
      }}
    >
      <Tabs defaultValue="upload">
        <TabsList className="w-full">
          <TabsTrigger value="upload">
            <FolderOpen />
            Computer
          </TabsTrigger>
          <TabsTrigger value="url">
            <Link />
            URL
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upload" className="p-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
          <Button
            size="sm"
            className="w-full cursor-pointer"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <CirclePlus />
            {uploading ? "Uploading..." : "Choose Image"}
          </Button>
        </TabsContent>
        <TabsContent value="url">
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Image URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && url.trim()) {
                  handleUrlSubmit();
                }
              }}
            />
            <Button
              size="sm"
              className="w-full cursor-pointer"
              variant="outline"
              onClick={handleUrlSubmit}
              disabled={!url.trim()}
            >
              <CirclePlus />
              Insert Image
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InsertImagePopover;
