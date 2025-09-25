import { $isRangeSelection, BaseSelection, RangeSelection } from "lexical";
import { $isHeadingNode } from "@lexical/rich-text";
import { $isListNode } from "@lexical/list";

type TextFormat = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
};

type TextAlignment = "left" | "center" | "right" | "justify";

export type TextLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "paragraph";

interface ParagraphElement {
  type: "paragraph";
}
interface ListElement {
  type: "list";
  // Possible values: "bullet" for bulleted lists, "number" for numbered lists
  listType: "bullet" | "number";
}

interface HeadingElement {
  type: "heading";
  tag: TextLevel;
}

type EditorElement = HeadingElement | ListElement | ParagraphElement;

export type SelectionState = {
  format: TextFormat;
  alignment: TextAlignment;
  textColor: string; // optional, for future use
  element: ParagraphElement | ListElement | HeadingElement | null;
};

export const DEFAULT_SELECTION_STATE: SelectionState = {
  format: {
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
  },
  alignment: "left",
  textColor: "#000000",
  element: null,
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

const getElement = (selection: RangeSelection): EditorElement | null => {
  const nodes = selection.getNodes();
  if (!nodes || nodes.length === 0) return null;

  const firstNode = nodes[0];
  const elementNode = firstNode.getTopLevelElement();
  if ($isHeadingNode(elementNode)) {
    return { type: "heading", tag: elementNode.getTag() as TextLevel };
  } else if ($isListNode(elementNode)) {
    const listType = elementNode.getListType();
    if (listType === "bullet" || listType === "number") {
      return { type: "list", listType: listType };
    }
  } else {
    return { type: "paragraph" };
  }
  return null;
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
    const textColor = getTextColor(selection);
    const element = getElement(selection);
    return { format, alignment, textColor, element };
  }
  return DEFAULT_SELECTION_STATE;
}
