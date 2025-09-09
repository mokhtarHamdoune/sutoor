import { $isRangeSelection, BaseSelection, RangeSelection } from "lexical";

type TextFormat = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
};

type TextAlignment = "left" | "center" | "right" | "justify";

type SelectionState = {
  format: TextFormat | null;
  alignment: TextAlignment | null;
};

const DEFAULT_SELECTION_STATE: SelectionState = {
  format: {
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
  },
  alignment: "left",
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
      return parent.getFormatType() as TextAlignment;
    }
    return "left";
  }
  return "left";
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
    return { format, alignment };
  }
  return DEFAULT_SELECTION_STATE;
}
