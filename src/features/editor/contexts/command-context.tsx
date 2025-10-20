// CommandPlugin/command-context.tsx
import { createContext, useState, useCallback } from "react";
import { LexicalEditor } from "lexical";

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  keywords: string[]; // ['/h1', '/heading']
  icon?: React.ReactNode;
  category?: "basic" | "media" | "advanced";
  execute: (editor: LexicalEditor) => void;
}

interface CommandContextType {
  commands: CommandItem[];
  registerCommand: (command: CommandItem) => () => void; // Returns cleanup
}

export const CommandContext = createContext<CommandContextType | null>(null);

export const CommandProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [commands, setCommands] = useState<CommandItem[]>([]);

  const registerCommand = useCallback((command: CommandItem) => {
    setCommands((prev) => {
      // Avoid duplicates
      if (prev.some((c) => c.id === command.id)) return prev;
      return [...prev, command];
    });

    // Return cleanup function
    return () => {
      setCommands((prev) => prev.filter((c) => c.id !== command.id));
    };
  }, []);

  return (
    <CommandContext.Provider value={{ commands, registerCommand }}>
      {children}
    </CommandContext.Provider>
  );
};
