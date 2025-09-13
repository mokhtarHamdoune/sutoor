import { $isRangeSelection, BaseSelection, RangeSelection } from "lexical";
import { $isHeadingNode } from "@lexical/rich-text";

type TextFormat = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
};

type TextAlignment = "left" | "center" | "right" | "justify";

type TextLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "paragraph";

export type SelectionState = {
  format: TextFormat;
  alignment: TextAlignment;
  level: TextLevel;
};

export const DEFAULT_SELECTION_STATE: SelectionState = {
  format: {
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
  },
  alignment: "left",
  level: "paragraph",
};

const getTextFormat = (selection: RangeSelection): TextFormat => {
  return {
    bold: selection.hasFormat("bold"),
    italic: selection.hasFormat("italic"),
    underline: selection.hasFormat("underline"),
    strikethrough: selection.hasFormat("strikethrough"),
  };
};

const getTextAlignment = (selection: RangeSelection): TextAlignment => {
  const selectionNodes = selection.getNodes();
  if (selectionNodes.length > 0) {
    const firstNode = selectionNodes[0];
    const parent = firstNode.getParent();
    if (parent) {
      return (parent.getFormatType() as TextAlignment) || "left";
    }
    return "left";
  }
  return "left";
};

/**
 * Detect the text level for the current selection.
 * Walks up from the first selected node to find an element with a heading tag (h1..h6).
 * Falls back to "paragraph" when no heading tag is found.
 */
const getTextLevel = (selection: RangeSelection): TextLevel => {
  const nodes = selection.getNodes();
  if (!nodes || nodes.length === 0) return "paragraph";

  const firstNode = nodes[0];
  const elementNode = firstNode.getTopLevelElement();
  if ($isHeadingNode(elementNode)) {
    return elementNode.getTag();
  }
  return "paragraph";
};
/**
 * Placeholder for future central selection dispatcher.
 * For now it just logs selection presence; the plugin calls this
 * on updates and later this function can forward to specific checkers.
 */
export function handleSelectionUpdate(
  selection: BaseSelection
): SelectionState {
  if ($isRangeSelection(selection)) {
    const format = getTextFormat(selection);
    const alignment = getTextAlignment(selection);
    const level = getTextLevel(selection);
    return { format, alignment, level };
  }
  return DEFAULT_SELECTION_STATE;
}
