import { useEffect, useRef, useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/shared/ui/command";
import { type CommandItem as CommandItemType } from "../../contexts/command-context";
import { LexicalEditor } from "lexical";

type CommandPanelProps = {
  position: { top: number; left: number };
  commands: CommandItemType[];
  onClose: () => void;
  editor: LexicalEditor;
};
// TODO: document the header of this file
const CommandPanel = ({
  position,
  onClose,
  commands,
  editor,
}: CommandPanelProps) => {
  const commandPanelRef = useRef<HTMLDivElement>(null);
  const commandInputRef = useRef<HTMLInputElement>(null);
  const [commandPanelHeight, setCommandHeight] = useState(0);

  // Handle click outside to close popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        commandPanelRef.current &&
        !commandPanelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    // Add event listener with a small delay to avoid immediate close
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Handle escape key to close panel
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    setTimeout(() => {
      setCommandHeight(commandPanelRef.current?.offsetHeight || 0);
      commandInputRef.current?.focus();
    }, 50); // Log position every 2 seconds
  }, []);

  useEffect(() => {
    if (commandPanelHeight > 0) {
      commandInputRef.current?.focus();
    }
  }, [commandPanelHeight]);

  return (
    <div
      ref={commandPanelRef}
      style={{
        // Position above the cursor line with 8px gap
        zIndex: 1000,
        position: "absolute",
        visibility: commandPanelHeight ? "visible" : "hidden",
        top: `${position.top - commandPanelHeight - 4}px`,
        left: `${position.left}px`,
      }}
    >
      <Command className="rounded-lg border shadow-md md:min-w-[450px]">
        <CommandInput
          ref={commandInputRef}
          placeholder="Type a command or search..."
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {commands.map((command) => (
            <CommandItem
              key={command.id}
              // onClick={() => {
              //   command.execute(editor);
              //   onClose();
              // }}
              onSelect={() => {
                command.execute(editor);
                onClose();
              }}
              className="cursor-pointer"
            >
              {command.icon && <span>{command.icon}</span>}
              {command.label}
            </CommandItem>
          ))}
        </CommandList>
      </Command>
    </div>
  );
};

export default CommandPanel;
