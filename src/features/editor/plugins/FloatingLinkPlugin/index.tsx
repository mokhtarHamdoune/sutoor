import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_HIGH,
} from "lexical";
import { useEffect, useRef, useState } from "react";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { sanitizeUrl } from "../../utils/url";
import { BadgeCheck, Trash } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupInput,
} from "@/shared/ui/input-group";
import { SHOW_FLOATING_LINK_INPUT_COMMAND } from "./command";
import {
  getNearestLinkAncestor,
  getSelectionCoordinates,
  isLinkSelection,
} from "../../utils/selection-checkers";
// TODO: Add clickable link that opens the link in new tab
// TODO: Show the floating input when user clicks on existing links for editing
// TODO: Add the enter keydown later

export const FloatingLink = () => {
  const [editor] = useLexicalComposerContext();
  const [linkBoxCoordinates, setLinkBoxCoordinates] = useState<null | {
    top: number;
    left: number;
  }>(null);
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

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
        } else {
          setLinkBoxCoordinates(null);
        }
        return false;
      },
      COMMAND_PRIORITY_HIGH
    );
  }, [editor]);

  useEffect(() => {
    // Show link input when user clicks inside a link (but not at the end)
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

          // Only show the input if cursor is NOT at the end of the text
          // This prevents the input from appearing when typing after a link
          if (offset < textContent.length) {
            const coords = getSelectionCoordinates();
            const linkNode = getNearestLinkAncestor(anchorNode);
            if (linkNode) {
              setCurrentUrl(linkNode.getURL());
              setLinkBoxCoordinates(coords);
            }
          } else {
            // Cursor is at the end, hide the input
            setLinkBoxCoordinates(null);
          }
        } else {
          // Selection is not in a link or not collapsed, hide the input
          setLinkBoxCoordinates(null);
        }
      });
    });
  }, [editor]);

  useEffect(() => {
    // Focus the input when the floating link appears
    if (linkBoxCoordinates && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [linkBoxCoordinates]);

  if (linkBoxCoordinates === null) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: linkBoxCoordinates
          ? `${linkBoxCoordinates.top + 20}px`
          : "-1000px", // Position above selection or hide
        left: linkBoxCoordinates ? `${linkBoxCoordinates.left}px` : "-1000px",
      }}
      className="flex items-center gap-x-4 p-3 border rounded-md shadow bg-primary-foreground"
    >
      <InputGroup className="w-64 bg-white">
        <InputGroupInput
          ref={inputRef}
          placeholder="example.com"
          className="!pl-1"
          value={currentUrl}
          onChange={(e) => {
            setCurrentUrl(e.target.value);
          }}
        />
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
      </InputGroup>

      <div className="flex flex-col items-center gap-y-1">
        <BadgeCheck
          size={20}
          className="text-slate-400 hover:text-slate-300 cursor-pointer"
          onClick={() => {
            if (currentUrl.trim()) {
              editor.dispatchCommand(
                TOGGLE_LINK_COMMAND,
                sanitizeUrl(currentUrl.trim())
              );
            }
            setLinkBoxCoordinates(null);
            setCurrentUrl("");
          }}
        />
        <Trash
          size={20}
          className="text-red-300 hover:text-red-200 cursor-pointer"
          onClick={() => {
            setLinkBoxCoordinates(null);
            setCurrentUrl("");
          }}
        />
      </div>
    </div>
  );
};

export default FloatingLink;
