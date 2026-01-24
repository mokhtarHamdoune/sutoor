import { Link } from "lucide-react";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import type { ToggleTool } from "../interfaces/tool";
import type { ToolFactoryContext } from "./types";
import { getSelectionCoordinates } from "../utils/selection-checkers";
import { SHOW_FLOATING_LINK_INPUT_COMMAND } from "../plugins/FloatingLinkPlugin/command";

/**
 * Creates a Link tool.
 * Toggles link on selected text - shows floating input for new links,
 * removes link if already active.
 */
export const createLinkTool = ({
  editor,
  selectionState,
}: ToolFactoryContext): ToggleTool => ({
  id: "link",
  label: "Link",
  icon: <Link />,
  type: "toggle",
  execute: () => {
    if (selectionState.isLinkActive) {
      // Remove existing link
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    } else {
      // Show floating link input for new links
      const coordinates = getSelectionCoordinates();
      editor.dispatchCommand(SHOW_FLOATING_LINK_INPUT_COMMAND, {
        url: selectionState.linkUrl || "",
        coordinates: coordinates || undefined,
      });
    }
  },
  isActive: selectionState.isLinkActive,
});
