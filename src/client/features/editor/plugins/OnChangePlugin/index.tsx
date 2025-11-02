import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes } from "@lexical/html";
import { $getRoot, EditorState } from "lexical";
import { useEffect } from "react";

export type EditorContent = {
  html: string;
  json: string;
  isEmpty: boolean;
};

type OnChangePluginProps = {
  onChange?: (content: EditorContent, editorState: EditorState) => void;
  ignoreSelectionChange?: boolean;
};

export default function OnChangePlugin({
  onChange,
  ignoreSelectionChange = true,
}: OnChangePluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!onChange) return;

    return editor.registerUpdateListener(
      ({ editorState, dirtyElements, dirtyLeaves }) => {
        // Skip if only selection changed and we're ignoring selection changes
        if (
          ignoreSelectionChange &&
          dirtyElements.size === 0 &&
          dirtyLeaves.size === 0
        ) {
          return;
        }

        editorState.read(() => {
          const html = $generateHtmlFromNodes(editor);
          const json = JSON.stringify(editorState.toJSON());
          const root = $getRoot();
          const isEmpty = root.getTextContent().trim() === "";

          onChange(
            {
              html,
              json,
              isEmpty,
            },
            editorState
          );
        });
      }
    );
  }, [editor, onChange, ignoreSelectionChange]);

  return null;
}
