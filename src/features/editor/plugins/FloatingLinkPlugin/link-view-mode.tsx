import { ExternalLink, Pencil, Trash } from "lucide-react";
import { Button } from "@/shared/ui/button";

export interface LinkViewModeProps {
  url: string;
  onEdit: () => void;
  onRemove: () => void;
  onOpen: () => void;
}

export const LinkViewMode: React.FC<LinkViewModeProps> = ({
  url,
  onEdit,
  onRemove,
  onOpen,
}) => {
  // Simple URL truncation: show first 47 chars + "..." if too long
  const displayUrl = url.length > 50 ? url.substring(0, 47) + "..." : url;
  // Fallback for empty URLs
  const urlToDisplay = displayUrl || "No URL";

  return (
    <div className="flex flex-col gap-y-2">
      {/* URL Display */}
      <div className="flex items-center gap-x-2 p-2">
        <ExternalLink size={16} className="text-slate-400 flex-shrink-0" />
        <span className="text-sm text-slate-700 truncate" title={url}>
          {urlToDisplay}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-x-2">
        <Button
          onClick={onOpen}
          disabled={!url}
          variant="default"
          size="sm"
          className="cursor-pointer"
        >
          <ExternalLink />
          Open
        </Button>
        <Button
          onClick={onEdit}
          variant="secondary"
          size="sm"
          className="cursor-pointer"
        >
          <Pencil />
          Edit
        </Button>
        <Button
          onClick={onRemove}
          variant="secondary"
          size="sm"
          className="cursor-pointer"
        >
          <Trash className="text-red-500" />
          Remove
        </Button>
      </div>
    </div>
  );
};
