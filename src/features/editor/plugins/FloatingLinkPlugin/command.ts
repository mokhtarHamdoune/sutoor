import { createCommand } from "lexical";

// Custom commands
export const SHOW_FLOATING_LINK_INPUT_COMMAND = createCommand<{
  url?: string;
  coordinates?: { top: number; left: number };
}>("SHOW_FLOATING_LINK_INPUT_COMMAND");
