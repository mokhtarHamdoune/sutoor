import React from "react";
import { ToggleTool } from "../../interfaces/tool";
import { Toggle } from "@/shared/ui/toggle";

const ToolButton: React.FC<{
  tool: ToggleTool;
}> = ({ tool }) => {
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    // Check active/disabled on mount and on editor state changes
    const updateState = () => {
      if (tool.isActive) {
        try {
          setActive(tool.isActive);
        } catch {
          setActive(false);
        }
      }
    };

    // initial
    updateState();
  }, [tool.isActive]);

  return (
    <Toggle
      type="button"
      title={tool.label}
      onClick={() => tool.execute()}
      aria-pressed={tool.type === "toggle" ? active : undefined}
      className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      {tool.icon ?? tool.label}
    </Toggle>
  );
};
export default ToolButton;
