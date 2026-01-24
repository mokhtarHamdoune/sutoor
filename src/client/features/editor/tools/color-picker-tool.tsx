import { $getSelection } from "lexical";
import { $patchStyleText } from "@lexical/selection";
import type { ValueTool } from "../interfaces/tool";
import type { ToolFactoryContext } from "./types";

/**
 * Creates a Color Picker tool.
 * Allows changing the text color of selected content.
 */
export const createColorPickerTool = ({
  editor,
  selectionState,
}: ToolFactoryContext): ValueTool => ({
  id: "color-picker",
  label: "Color Picker",
  type: "value",
  value: selectionState.textColor,
  execute: (value) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!selection) return;
      $patchStyleText(selection, { color: value });
    });
  },
});
