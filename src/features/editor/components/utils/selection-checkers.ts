import { $isRangeSelection, BaseSelection, RangeSelection } from "lexical";
import { $isHeadingNode } from "@lexical/rich-text";

type TextFormat = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
};

type TextAlignment = "left" | "center" | "right" | "justify";

export type TextLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "paragraph";

export type SelectionState = {
  format: TextFormat;
  alignment: TextAlignment;
  level: TextLevel;
  textColor: string; // optional, for future use
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
  textColor: "#000000",
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
 * Get the text color for the current selection.
 * Extracts hex color from selection style, defaults to black.
 *
 * @param selection - The current range selection
 * @returns The hex color value of the selected text
 */
const getTextColor = (selection: RangeSelection): string => {
  // For now, return the default color
  // TODO: Implement proper color extraction when we have color styling in place
  const selectionStyle = selection.style;
  const colorMatch = selectionStyle.match(/color:\s*(#[0-9a-fA-F]{6})/);
  if (colorMatch && colorMatch?.length > 1 && colorMatch[1]) {
    return colorMatch[1];
  }
  return "#000000";
};
/**
 * Central selection state handler that extracts comprehensive formatting information.
 * Analyzes the current selection and returns formatting state including:
 * - Text formatting (bold, italic, underline, strikethrough)
 * - Text alignment (left, center, right, justify)
 * - Text level/heading (h1-h6 or paragraph)
 * - Text color (extracted from inline styles, defaults to black)
 *
 * @param selection - The current base selection from the editor
 * @returns SelectionState object containing all formatting information
 */
export function handleSelectionUpdate(
  selection: BaseSelection
): SelectionState {
  if ($isRangeSelection(selection)) {
    const format = getTextFormat(selection);
    const alignment = getTextAlignment(selection);
    const level = getTextLevel(selection);
    const textColor = getTextColor(selection);
    return { format, alignment, level, textColor };
  }
  return DEFAULT_SELECTION_STATE;
}
