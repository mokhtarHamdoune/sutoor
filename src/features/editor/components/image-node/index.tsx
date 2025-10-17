/**
 * ImageComponent - Main component for rendering images in the Lexical editor
 *
 * This is the entry point for image rendering. It orchestrates:
 * - Image loading and caching (LazyImage + useSuspenseImage)
 * - Selection and focus states
 * - Resize functionality (ImageResizer)
 * - Caption support
 * - Keyboard commands (delete, backspace)
 */

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  DRAGSTART_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
} from "lexical";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { $isImageNode } from "../../nodes/ImageNode";
import { BrokenImage } from "./broken-image";
import ImageResizer from "./image-resizer";
import { LazyImage } from "./lazy-image";

interface ImageComponentProps {
  src: string;
  altText: string;
  caption: string;
  nodeKey: string;
  width: "inherit" | number;
  height: "inherit" | number;
  maxWidth: number;
  resizable: boolean;
}

export default function ImageComponent({
  src,
  altText,
  caption,
  nodeKey,
  width,
  height,
  maxWidth,
  resizable,
}: ImageComponentProps) {
  // ─────────────────────────────────────────────────────────────────────
  // STATE & REFS
  // ─────────────────────────────────────────────────────────────────────
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isLoadError, setIsLoadError] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  // Selection state - manages if this image is selected
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);

  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();

  // ─────────────────────────────────────────────────────────────────────
  // COMPUTED VALUES
  // ─────────────────────────────────────────────────────────────────────

  // Check if this image is in the current node selection
  const isInNodeSelection = useMemo(
    () =>
      isSelected &&
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        return $isNodeSelection(selection) && selection.has(nodeKey);
      }),
    [editor, isSelected, nodeKey]
  );

  const isFocused = (isSelected || isResizing) && isEditable;
  const draggable = isInNodeSelection && !isResizing;

  // ─────────────────────────────────────────────────────────────────────
  // EVENT HANDLERS
  // ─────────────────────────────────────────────────────────────────────

  /**
   * Click handler - selects the image when clicked
   */
  const onClick = useCallback(
    (payload: MouseEvent) => {
      const event = payload;

      // Don't change selection while resizing
      if (isResizing) {
        return true;
      }

      if (event.target === imageRef.current) {
        if (event.shiftKey) {
          // Shift+click: toggle selection
          setSelected(!isSelected);
        } else {
          // Normal click: clear other selections and select this image
          clearSelection();
          setSelected(true);
        }
        return true;
      }

      return false;
    },
    [isResizing, isSelected, setSelected, clearSelection]
  );

  /**
   * Update caption text
   */
  const onCaptionChange = useCallback(
    (newCaption: string) => {
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if ($isImageNode(node)) {
          node.setCaption(newCaption);
        }
      });
    },
    [editor, nodeKey]
  );

  /**
   * Resize handlers - called by ImageResizer component
   */
  const onResizeStart = useCallback(() => {
    setIsResizing(true);
  }, []);

  const onResizeEnd = useCallback(
    (nextWidth: "inherit" | number, nextHeight: "inherit" | number) => {
      // Delay to prevent immediate click after resize
      setTimeout(() => {
        setIsResizing(false);
      }, 200);

      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if ($isImageNode(node)) {
          node.setWidthAndHeight(nextWidth, nextHeight);
        }
      });
    },
    [editor, nodeKey]
  );

  // ─────────────────────────────────────────────────────────────────────
  // EFFECTS - Register Lexical commands
  // ─────────────────────────────────────────────────────────────────────

  useEffect(() => {
    return mergeRegister(
      // Click to select
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        onClick,
        COMMAND_PRIORITY_LOW
      ),

      // Prevent default browser image drag behavior
      editor.registerCommand<DragEvent>(
        DRAGSTART_COMMAND,
        (event) => {
          if (event.target === imageRef.current) {
            event.preventDefault();
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),

      // Delete image when pressing Delete or Backspace while selected
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        (event) => {
          if (isSelected && $isNodeSelection($getSelection())) {
            event.preventDefault();
            const node = $getNodeByKey(nodeKey);
            if (node) {
              node.remove();
            }
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),

      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        (event) => {
          if (isSelected && $isNodeSelection($getSelection())) {
            event.preventDefault();
            const node = $getNodeByKey(nodeKey);
            if (node) {
              node.remove();
            }
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, onClick, isSelected, nodeKey]);

  // ─────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────

  return (
    <Suspense fallback={null}>
      <div className="relative inline-block">
        {/* Main image */}
        <div draggable={draggable}>
          {isLoadError ? (
            <BrokenImage />
          ) : (
            <LazyImage
              className={isFocused ? "ring-2 ring-blue-500 rounded" : ""}
              src={src}
              altText={altText}
              imageRef={imageRef}
              width={width}
              height={height}
              maxWidth={maxWidth}
              onError={() => setIsLoadError(true)}
            />
          )}
        </div>

        {/* Caption input - shows below image */}
        {!isLoadError && (
          <input
            type="text"
            value={caption}
            onChange={(e) => onCaptionChange(e.target.value)}
            placeholder="Add a caption..."
            className="w-full px-2 py-1 text-sm text-center text-gray-600 border-none outline-none focus:outline-none placeholder-gray-400"
            disabled={!isEditable}
          />
        )}

        {/* Resize handles - only show when selected */}
        {resizable && isInNodeSelection && isFocused && !isLoadError && (
          <ImageResizer
            editor={editor}
            imageRef={imageRef}
            maxWidth={maxWidth}
            onResizeStart={onResizeStart}
            onResizeEnd={onResizeEnd}
          />
        )}
      </div>
    </Suspense>
  );
}
