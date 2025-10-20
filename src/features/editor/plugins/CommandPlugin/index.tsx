import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createTextNode, $getSelection, $isRangeSelection } from "lexical";
import { useCallback, useEffect, useState } from "react";
import CommandPanel from "./command-panel";
import { useCommandRegistry } from "../../hooks";

// TODO:  Document the header of this file
// DONE:  Add Command close when the user delete all the text, This impossible because the popover will be focused so typing will be withing the popover
// DONE:  Add command close when the user remove the /
// DONE:  Add Command close on Escape key press
// DONE:  Add the registry pattern discuss with claud
// DONE:  Add image block command as example
// DONE: when the command panels goes the / cammand also otherwise it will apeare again
/// because the fact that the update listener will detect the / again and popover will show again

export const CommandPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [panelPosition, setPanelPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const { commands } = useCommandRegistry();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          const text = anchorNode.getTextContent();

          // Command open if  "/" is at the begining of the element
          // OR after a space
          if (text.startsWith("/") || /\s+\//.test(text)) {
            if (!panelPosition) {
              const element = anchorNode.getTopLevelElementOrThrow();

              // Get the DOM element for positioning
              const domElement = editor.getElementByKey(element.getKey());
              if (domElement) {
                const rect = domElement.getBoundingClientRect();
                // Position popover above the current line
                setPanelPosition({
                  top: rect.top,
                  left: rect.left,
                });
              }
            }
          }
        }
      });
    });
  }, [editor, panelPosition]);

  const onClosePanel = useCallback(() => {
    setPanelPosition(null);
    // we remove the / from the editor
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const text = anchorNode.getTextContent();
        const slashIndex = text.search(/\s+\//);
        const newText =
          text.substring(0, slashIndex) +
          text.substring(slashIndex).replace("/", "");
        const newTextNode = $createTextNode(newText);
        anchorNode.replace(newTextNode);
      }
    });
  }, [editor]);

  if (!panelPosition) {
    return null;
  }

  return (
    <CommandPanel
      position={panelPosition}
      onClose={onClosePanel}
      commands={commands}
      editor={editor}
    />
  );
};

export default CommandPlugin;
