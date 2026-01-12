import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Undo, Redo } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import Toolbar from "../components/toolbar/toolbar";
import { Tool } from "../interfaces/tool";
import { mergeRegister } from "@lexical/utils";

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [editor]);

  const tools: Tool[] = [
    {
      id: "undo",
      type: "toggle",
      label: "Undo",
      icon: <Undo size={18} />,
      execute: () => {
        editor.dispatchCommand(UNDO_COMMAND, undefined);
      },
      isActive: false,
      disabled: !canUndo,
    },
    {
      id: "redo",
      type: "toggle",
      label: "Redo",
      icon: <Redo size={18} />,
      execute: () => {
        editor.dispatchCommand(REDO_COMMAND, undefined);
      },
      isActive: false,
      disabled: !canRedo,
    },
  ];

  return (
    <div className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <Toolbar tools={tools} />
    </div>
  );
}
