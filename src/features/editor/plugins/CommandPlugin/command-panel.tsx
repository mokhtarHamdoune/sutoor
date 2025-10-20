import { useEffect, useMemo, useRef, useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/shared/ui/command";
import { type CommandItem as RegisteredCommand } from "../../contexts/command-context";
import { LexicalEditor } from "lexical";

/**
 * CommandPanel
 *
 * A floating command palette UI that displays available editor commands.
 * Positioned absolutely above the current cursor line and supports:
 * - Keyboard navigation and selection
 * - Click outside to close
 * - Escape key to dismiss
 * - Auto-focus on mount
 *
 * The panel uses a visibility technique where it renders hidden initially,
 * measures its height, then positions itself above the cursor with the correct offset.
 */

// Layout constants
const PANEL_Z_INDEX = 1000; // Z-index to ensure panel appears above editor content
const PANEL_GAP = 4; // Gap in pixels between panel and cursor line
const CLICK_OUTSIDE_DELAY = 100; // Delay before enabling click-outside to prevent immediate close
const MOUNT_DELAY = 50; // Delay for measuring panel height and focusing input

type CommandPanelProps = {
  /** Absolute position where the panel should appear */
  position: { top: number; left: number };
  /** List of registered commands to display */
  commands: RegisteredCommand[];
  /** Callback when panel should be closed */
  onClose: () => void;
  /** Lexical editor instance for executing commands */
  editor: LexicalEditor;
};

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
    }, CLICK_OUTSIDE_DELAY);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Register escape key handler
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

  /**
   * On mount: measure panel height and focus input.
   * Height is needed to position the panel above the cursor line.
   * Uses a small delay to ensure the panel has fully rendered.
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCommandHeight(commandPanelRef.current?.offsetHeight || 0);
    }, MOUNT_DELAY);

    return () => clearTimeout(timeoutId);
  }, []);

  /** After the command panel popped up and there is a height
   * Focus the command input for immediate typing
   */
  useEffect(() => {
    if (commandPanelHeight > 0) {
      commandInputRef.current?.focus();
    }
  }, [commandPanelHeight]);

  /**
   * Calculate inline styles for panel positioning.
   * Panel is positioned above the cursor with proper gap and visibility control.
   */
  const panelStyle = useMemo(
    () => ({
      zIndex: PANEL_Z_INDEX,
      position: "absolute" as const,
      visibility: commandPanelHeight
        ? ("visible" as const)
        : ("hidden" as const),
      top: `${position.top - commandPanelHeight - PANEL_GAP}px`,
      left: `${position.left}px`,
    }),
    [commandPanelHeight, position]
  );

  return (
    <div ref={commandPanelRef} style={panelStyle}>
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
