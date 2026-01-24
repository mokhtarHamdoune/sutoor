import React, { memo, useMemo } from "react";
import FloatingToolbar from "@/client/features/editor/components/floating-toolbar";
import Toolbar from "@/client/features/editor/components/toolbar/toolbar";
import { Tool } from "../interfaces/tool";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useSelectionState } from "../hooks/use-selection-state";
import { createFormattingToolGroup } from "../tools/formatting-tools";
import { createAlignmentToolGroup } from "../tools/alignment-tools";
import { createBlockTypeTool } from "../tools/block-type-tools";
import { createListToolGroup } from "../tools/list-tools";
import { createLinkTool } from "../tools/link-tool";
import { createColorPickerTool } from "../tools/color-picker-tool";

export const FloatingToolbarPlugin: React.FC = memo(() => {
  const [editor] = useLexicalComposerContext();
  const selectionState = useSelectionState();

  const tools: Tool[] = useMemo(() => {
    // Use the block type tool factory
    const textLevel = createBlockTypeTool({ editor, selectionState });

    // Use the formatting tool factory
    const formatingTextTools = createFormattingToolGroup({
      editor,
      selectionState,
    });

    // Use the alignment tool factory
    const alignmentsTool = createAlignmentToolGroup({ editor, selectionState });

    // Use the list tool factory
    const listTools = createListToolGroup({ editor, selectionState });

    // Use the link tool factory (standalone, not in a group)
    const linkTool = createLinkTool({ editor, selectionState });

    // Use the color picker tool factory
    const colorPickerTool = createColorPickerTool({ editor, selectionState });

    return [
      textLevel,
      formatingTextTools,
      linkTool,
      alignmentsTool,
      listTools,
      colorPickerTool,
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectionState.alignment,
    selectionState.format,
    selectionState.element,
    selectionState.textColor,
    selectionState.isLinkActive,
    selectionState.linkUrl,
  ]);

  return (
    <FloatingToolbar>
      <Toolbar tools={tools} />
    </FloatingToolbar>
  );
});

FloatingToolbarPlugin.displayName = "FloatingToolbarPlugin";

export default FloatingToolbarPlugin;
