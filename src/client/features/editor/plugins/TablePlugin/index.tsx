import { TablePlugin as LexicalTablePlugin } from "@lexical/react/LexicalTablePlugin";
import { useEffect } from "react";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import { useCommandRegistry } from "../../hooks";
import { Table } from "lucide-react";

export function TablePlugin() {
  const { registerCommand } = useCommandRegistry();

  useEffect(() => {
    // Register the slash command
    const cleanup = registerCommand({
      id: "insert-table",
      label: "Table",
      keywords: ["/table", "table", "grid"],
      icon: <Table size={18} />,
      category: "basic",
      execute: (editor) => {
        // Insert a 3x3 table by default
        editor.dispatchCommand(INSERT_TABLE_COMMAND, {
          columns: "3",
          rows: "3",
        });
      },
    });

    return cleanup;
  }, [registerCommand]);

  return <LexicalTablePlugin />;
}

export default TablePlugin;
