import { BadgeCheck, X } from "lucide-react";
import { Button } from "@/client/shared/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupInput,
} from "@/client/shared/ui/input-group";

export interface LinkEditModeProps {
  url: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export const LinkEditMode: React.FC<LinkEditModeProps> = ({
  url,
  onChange,
  onSave,
  onCancel,
  inputRef,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <div className="flex flex-col gap-y-2">
      <InputGroup className="w-64 bg-white">
        <InputGroupInput
          ref={inputRef}
          placeholder="example.com"
          className="!pl-1"
          value={url}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
      </InputGroup>

      <div className="flex items-center justify-between">
        <Button
          onClick={onCancel}
          variant="outline"
          size="sm"
          className="cursor-pointer"
        >
          <X />
          Cancel
        </Button>
        <Button
          onClick={onSave}
          disabled={!url.trim()}
          variant="default"
          size="sm"
          className="cursor-pointer disabled:cursor-not-allowed"
        >
          <BadgeCheck />
          Save
        </Button>
      </div>
    </div>
  );
};
