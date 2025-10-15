import { useEffect, useRef, useState } from "react";
import { InsertImagePayload } from "./index";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

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
  const [mode, setMode] = useState<"url" | "file" | null>(null);
  const [url, setUrl] = useState("");
  const [altText, setAltText] = useState("");
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
        altText: altText || "Image",
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onInsert({
            src: reader.result,
            altText: altText || file.name,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      ref={popoverRef}
      className="fixed z-[1000] w-80 bg-white rounded-lg border border-gray-200 shadow-lg p-4"
      style={{
        top: `${position.top + window.scrollY - 10}px`,
        left: `${position.left + window.scrollX}px`,
      }}
    >
      {!mode ? (
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-sm mb-2">Insert Image</h3>
          <Button variant="outline" size="sm" onClick={() => setMode("url")}>
            From URL
          </Button>
          <Button variant="outline" size="sm" onClick={() => setMode("file")}>
            From File
          </Button>
        </div>
      ) : mode === "url" ? (
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-sm">Insert from URL</h3>
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
          <Input
            placeholder="Alt text (optional)"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && url.trim()) {
                handleUrlSubmit();
              }
            }}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleUrlSubmit} disabled={!url.trim()}>
              Insert
            </Button>
            <Button size="sm" variant="outline" onClick={() => setMode(null)}>
              Back
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-sm">Upload from File</h3>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            autoFocus
          />
          <Input
            placeholder="Alt text (optional)"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
          />
          <Button size="sm" variant="outline" onClick={() => setMode(null)}>
            Back
          </Button>
        </div>
      )}
    </div>
  );
};

export default InsertImagePopover;
