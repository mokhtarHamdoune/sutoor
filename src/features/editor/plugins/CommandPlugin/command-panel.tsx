import { useEffect, useRef, useState } from "react";

import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/shared/ui/command";

type CommandPanelProps = {
  position: { top: number; left: number };
  onClose: () => void;
};
// TODO: document the header of this file
const CommandPanel = ({ position, onClose }: CommandPanelProps) => {
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

  useEffect(() => {
    setTimeout(() => {
      setCommandHeight(commandPanelRef.current?.offsetHeight || 0);
      commandInputRef.current?.focus();
    }, 200); // Log position every 2 seconds
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
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <Calendar />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <Smile />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem disabled>
              <Calculator />
              <span>Calculator</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <User />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default CommandPanel;
