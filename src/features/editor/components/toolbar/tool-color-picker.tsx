import { Popover, PopoverTrigger, PopoverContent } from "@/shared/ui/popover";
import { HexColorPicker } from "react-colorful";
import { LexicalEditor } from "lexical";
import { ValueTool } from "../../interfaces/tool";
import { useState } from "react";

const ToolColorPicker = ({
  tool,
  editor,
}: {
  tool: ValueTool;
  editor: LexicalEditor;
}) => {
  const [color, setColor] = useState(tool.value || "#000000");

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    tool.execute(editor, newColor);
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
      <PopoverContent className="w-auto p-3">
        <HexColorPicker color={color} onChange={handleColorChange} />
      </PopoverContent>
    </Popover>
  );
};

export default ToolColorPicker;
