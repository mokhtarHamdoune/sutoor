import { useRef } from "react";
import useSelectionCoord from "../hooks/use-selection-coord";

export const SelectionTracker = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { coordinates } = useSelectionCoord();

  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      style={{
        top: (coordinates?.top || 0) - (ref.current?.offsetHeight || 0) - 10,
        left: coordinates?.left || 0,
        visibility: coordinates ? "visible" : "hidden",
      }}
      className={`absolute z-10 transition duration-150 ease-in ${
        coordinates ? "translate-y-1" : "-translate-y-1"
      }`}
    >
      <div className="relative">{children}</div>
    </div>
  );
};

export default SelectionTracker;
