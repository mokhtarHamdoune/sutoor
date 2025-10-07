import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_HIGH,
} from "lexical";
import { useEffect, useRef, useState } from "react";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { sanitizeUrl } from "../../utils/url";
import { BadgeCheck, Trash, ExternalLink, Pencil, X } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupInput,
} from "@/shared/ui/input-group";
import { Button } from "@/shared/ui/button";
import { SHOW_FLOATING_LINK_INPUT_COMMAND } from "./command";
import {
  getNearestLinkAncestor,
  getSelectionCoordinates,
  isLinkSelection,
} from "../../utils/selection-checkers";
// TODO: add https:// prefix by default when the user open up the url, the url does not open up properly
// TODO: refactor the FloatingLink component into smaller components for better readability and maintainability
export const FloatingLink = () => {
  const [editor] = useLexicalComposerContext();
  const [linkBoxCoordinates, setLinkBoxCoordinates] = useState<null | {
    top: number;
    left: number;
  }>(null);
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const originalUrlRef = useRef<string>(""); // Use ref instead of state - no re-renders needed

  useEffect(() => {
    return editor.registerCommand(
      SHOW_FLOATING_LINK_INPUT_COMMAND,
      (payload: {
        url?: string;
        coordinates?: { top: number; left: number };
      }) => {
        const { url = "", coordinates } = payload;

        if (coordinates) {
          setLinkBoxCoordinates(coordinates);
          setCurrentUrl(url);
          originalUrlRef.current = url; // Save original URL for cancel functionality
          setIsEditMode(true); // Start in edit mode for new links from toolbar
        } else {
          setLinkBoxCoordinates(null);
          setIsEditMode(false);
        }
        return false;
      },
      COMMAND_PRIORITY_HIGH
    );
  }, [editor]);

  useEffect(() => {
    // Show link popup when user clicks inside a link (but not at the end)
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (
          $isRangeSelection(selection) &&
          isLinkSelection(selection) &&
          selection.isCollapsed()
        ) {
          const anchorNode = selection.anchor.getNode();
          const offset = selection.anchor.offset;
          const textContent = anchorNode.getTextContent();

          // Only show the popup if cursor is NOT at the end of the text
          // This prevents the popup from appearing when typing after a link
          if (offset < textContent.length) {
            const coords = getSelectionCoordinates();
            const linkNode = getNearestLinkAncestor(anchorNode);
            if (linkNode) {
              const url = linkNode.getURL();
              setCurrentUrl(url);
              originalUrlRef.current = url; // Save original URL for cancel functionality
              setLinkBoxCoordinates(coords);
              setIsEditMode(false); // Start in view mode for existing links
            }
          } else {
            // Cursor is at the end, hide the popup
            setLinkBoxCoordinates(null);
          }
        } else {
          // Selection is not in a link or not collapsed, hide the popup
          setLinkBoxCoordinates(null);
        }
      });
    });
  }, [editor]);

  useEffect(() => {
    // Focus the input when the floating link appears in edit mode
    if (linkBoxCoordinates && isEditMode && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [linkBoxCoordinates, isEditMode]);

  // Handler functions for LinkViewMode
  const handleOpenLink = () => {
    if (currentUrl) {
      window.open(sanitizeUrl(currentUrl), "_blank", "noopener,noreferrer");
    }
  };

  const handleEditLink = () => {
    setIsEditMode(true);
  };

  const handleRemoveLink = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    setLinkBoxCoordinates(null);
    setCurrentUrl("");
  };

  // Handler functions for LinkEditMode
  const handleSaveLink = () => {
    if (currentUrl.trim()) {
      editor.dispatchCommand(
        TOGGLE_LINK_COMMAND,
        sanitizeUrl(currentUrl.trim())
      );
      setIsEditMode(false); // Switch back to view mode after saving
    }
  };

  const handleCancelEdit = () => {
    // If this was a new link (empty original URL), close the popup entirely
    if (!originalUrlRef.current.trim()) {
      setLinkBoxCoordinates(null);
      setCurrentUrl("");
    } else {
      // If editing existing link, restore original URL and go back to view mode
      setCurrentUrl(originalUrlRef.current);
      setIsEditMode(false);
    }
  };

  if (linkBoxCoordinates === null) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: linkBoxCoordinates
          ? `${linkBoxCoordinates.top + 20}px`
          : "-1000px",
        left: linkBoxCoordinates ? `${linkBoxCoordinates.left}px` : "-1000px",
      }}
      className="p-3 border rounded-md shadow bg-primary-foreground"
    >
      {isEditMode ? (
        <LinkEditMode
          url={currentUrl}
          onChange={setCurrentUrl}
          onSave={handleSaveLink}
          onCancel={handleCancelEdit}
          inputRef={inputRef}
        />
      ) : (
        <LinkViewMode
          url={currentUrl}
          onEdit={handleEditLink}
          onRemove={handleRemoveLink}
          onOpen={handleOpenLink}
        />
      )}
    </div>
  );
};

// View Mode Component - Shows link preview with actions
interface LinkViewModeProps {
  url: string;
  onEdit: () => void;
  onRemove: () => void;
  onOpen: () => void;
}

const LinkViewMode: React.FC<LinkViewModeProps> = ({
  url,
  onEdit,
  onRemove,
  onOpen,
}) => {
  // Simple URL truncation: show first 47 chars + "..." if too long
  const displayUrl = url.length > 50 ? url.substring(0, 47) + "..." : url;
  // Fallback for empty URLs
  const urlToDisplay = displayUrl || "No URL";

  return (
    <div className="flex flex-col gap-y-2">
      {/* URL Display */}
      <div className="flex items-center gap-x-2">
        <ExternalLink size={16} className="text-slate-400 flex-shrink-0" />
        <span className="text-sm text-slate-700 truncate" title={url}>
          {urlToDisplay}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-x-2">
        <Button
          onClick={onOpen}
          disabled={!url}
          variant="default"
          size="sm"
          className="cursor-pointer"
        >
          <ExternalLink />
          Open
        </Button>
        <Button
          onClick={onEdit}
          variant="secondary"
          size="sm"
          className="cursor-pointer"
        >
          <Pencil />
          Edit
        </Button>
        <Button
          onClick={onRemove}
          variant="secondary"
          size="sm"
          className="cursor-pointer"
        >
          <Trash className="text-red-500" />
          Remove
        </Button>
      </div>
    </div>
  );
};

// Edit Mode Component - Shows input field for editing link URL
interface LinkEditModeProps {
  url: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const LinkEditMode: React.FC<LinkEditModeProps> = ({
  url,
  onChange,
  onSave,
  onCancel,
  inputRef,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <div className="flex flex-col gap-y-2">
      <InputGroup className="w-64 bg-white">
        <InputGroupInput
          ref={inputRef}
          placeholder="example.com"
          className="!pl-1"
          value={url}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
      </InputGroup>

      <div className="flex items-center justify-between">
        <Button
          onClick={onCancel}
          variant="outline"
          size="sm"
          className="cursor-pointer"
        >
          <X />
          Cancel
        </Button>
        <Button
          onClick={onSave}
          disabled={!url.trim()}
          variant="default"
          size="sm"
          className="cursor-pointer disabled:cursor-not-allowed"
        >
          <BadgeCheck />
          Save
        </Button>
      </div>
    </div>
  );
};

export default FloatingLink;
