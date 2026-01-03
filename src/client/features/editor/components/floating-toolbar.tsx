import { useRef } from "react";
import useSelectionCoord from "../hooks/use-selection-coord";

const FloatingToolbar = ({ children }: { children: React.ReactNode }) => {
  const { coordinates } = useSelectionCoord();
  const ref = useRef<HTMLDivElement>(null);

  if (!coordinates) return null;

  return (
    <div
      ref={ref}
      style={{
        top: coordinates.top - (ref.current?.offsetHeight || 0) - 10,
        left: coordinates.left,
      }}
      className="absolute z-10"
    >
      <div className="relative">
        <div className="animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FloatingToolbar;
