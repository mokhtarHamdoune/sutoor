import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useMemo } from "react";
import Toolbar from "../components/toolbar/toolbar";
import { Tool } from "../interfaces/tool";
import {
  useHistoryState,
  createUndoTool,
  createRedoTool,
} from "../tools/history-tools";
import { createBlockTypeTool } from "../tools/block-type-tools";
import { createFormattingToolGroup } from "../tools/formatting-tools";
import { createAlignmentToolGroup } from "../tools/alignment-tools";
import { createListToolGroup } from "../tools/list-tools";
import { createColorPickerTool } from "../tools/color-picker-tool";
import { useSelectionState } from "../hooks/use-selection-state";

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const historyState = useHistoryState();
  const selectionState = useSelectionState();

  const tools: Tool[] = useMemo(
    () => [
      // History tools (undo/redo)
      createUndoTool({ editor, historyState }),
      createRedoTool({ editor, historyState }),
      // Block type (paragraph, headings, code block, quote)
      createBlockTypeTool({ editor, selectionState }),
      // Formatting tools (bold, italic, underline, strikethrough, code)
      createFormattingToolGroup({ editor, selectionState }),
      // Alignment tools (left, center, right, justify)
      createAlignmentToolGroup({ editor, selectionState }),
      // List tools (bullet, numbered)
      createListToolGroup({ editor, selectionState }),
      // Color picker
      createColorPickerTool({ editor, selectionState }),
    ],
    [editor, historyState, selectionState]
  );

  return (
    <div className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <Toolbar tools={tools} />
    </div>
  );
}
