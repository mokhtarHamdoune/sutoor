// Default Lexical commands that come built-in with the editor
import {
  $addUpdateTag,
  $getSelection,
  LexicalEditor,
  SKIP_SELECTION_FOCUS_TAG,
} from "lexical";
import { Heading1, Heading2, Heading3, Quote } from "lucide-react";
import {
  $createQuoteNode,
  $createHeadingNode,
  HeadingTagType,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { CommandItem } from "../contexts/command-context";

/**
 * Default commands that come with Lexical editor
 * These are basic text formatting and block type commands
 */
export const DEFAULT_COMMANDS: CommandItem[] = [
  {
    id: "heading1-command",
    label: "Heading 1",
    description: "Large section heading",
    keywords: ["h1", "heading1", "/h1", "/heading1"],
    icon: <Heading1 size={18} />,
    category: "basic",
    execute(editor: LexicalEditor) {
      editor.update(() => {
        $addUpdateTag(SKIP_SELECTION_FOCUS_TAG);
        const selection = $getSelection();
        $setBlocksType(selection, () =>
          $createHeadingNode("h1" as HeadingTagType)
        );
      });
    },
  },
  {
    id: "heading2-command",
    label: "Heading 2",
    description: "Medium section heading",
    keywords: ["h2", "heading2", "/h2", "/heading2"],
    icon: <Heading2 size={18} />,
    category: "basic",
    execute(editor: LexicalEditor) {
      editor.update(() => {
        $addUpdateTag(SKIP_SELECTION_FOCUS_TAG);
        const selection = $getSelection();
        $setBlocksType(selection, () =>
          $createHeadingNode("h2" as HeadingTagType)
        );
      });
    },
  },
  {
    id: "heading3-command",
    label: "Heading 3",
    description: "Small section heading",
    keywords: ["h3", "heading3", "/h3", "/heading3"],
    icon: <Heading3 size={18} />,
    category: "basic",
    execute(editor: LexicalEditor) {
      editor.update(() => {
        $addUpdateTag(SKIP_SELECTION_FOCUS_TAG);
        const selection = $getSelection();
        $setBlocksType(selection, () =>
          $createHeadingNode("h3" as HeadingTagType)
        );
      });
    },
  },
  {
    id: "quote-command",
    label: "Quote",
    description: "Change block to a quote",
    keywords: ["quote", "/quote"],
    icon: <Quote size={18} />,
    category: "basic",
    execute(editor: LexicalEditor) {
      editor.update(() => {
        $addUpdateTag(SKIP_SELECTION_FOCUS_TAG);
        const selection = $getSelection();
        $setBlocksType(selection, () => $createQuoteNode());
      });
    },
  },
  // Add more default commands here as needed:
  // - Bulleted list
  // - Numbered list
  // - Code block
  // - etc.
];
