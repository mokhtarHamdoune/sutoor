import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/client/shared/ui/popover";
import { HexColorPicker } from "react-colorful";
import { ValueTool } from "../../interfaces/tool";
import { memo, useEffect, useState } from "react";

type ToolColorPickerProps = {
  tool: ValueTool;
};

const ToolColorPicker = ({ tool }: ToolColorPickerProps) => {
  const [color, setColor] = useState(tool.value || "#000000");

  useEffect(() => {
    setColor(tool.value || "#000000");
  }, [tool.value]);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    // Use the latest picked color when executing the tool
    tool.execute(newColor);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
          style={{ backgroundColor: color }}
          aria-label="Pick color"
        />
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-3"
        onFocusOutside={(e) => {
          // Keep the popover open while interacting with the color picker UI
          e.preventDefault();
        }}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <HexColorPicker color={color} onChange={handleColorChange} />
      </PopoverContent>
    </Popover>
  );
};

export default memo(ToolColorPicker);
