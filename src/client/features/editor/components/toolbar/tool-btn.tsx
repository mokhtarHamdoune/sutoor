import React from "react";
import { ToggleTool } from "../../interfaces/tool";
import { Toggle } from "@/client/shared/ui/toggle";

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
      disabled={tool.disabled}
      onClick={() => tool.execute()}
      aria-pressed={tool.type === "toggle" ? active : undefined}
      size="sm"
      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
    >
      {tool.icon ?? tool.label}
    </Toggle>
  );
};
export default ToolButton;
