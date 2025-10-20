import { useContext } from "react";
import { CommandContext } from "../contexts/command-context";

export const useCommandRegistry = () => {
  const context = useContext(CommandContext);
  if (!context) {
    throw new Error("useCommandRegistry must be used within CommandProvider");
  }
  return context;
};
