import { useEffect, useRef } from "react";
import useSelectionCoord from "../hooks/use-selection-coord";

export const SelectionTracker = ({
  children,
  allowTracking: isTrackingAllowd,
}: {
  children: React.ReactNode;
  allowTracking: boolean;
}) => {
  const { coordinates, allowTracking, disableTracking } = useSelectionCoord();

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTrackingAllowd) {
      allowTracking();
    } else {
      disableTracking();
    }
  }, [isTrackingAllowd, disableTracking, allowTracking]);

  return (
    <div
      ref={ref}
      style={{
        top: (coordinates?.top || 0) - (ref.current?.offsetHeight || 0) - 10,
        left: coordinates?.left || 0,
        opacity: 1,
      }}
      className={`absolute z-10 transition duration-100 ease-in ${
        coordinates ? "translate-y-1" : "-translate-y-1"
      }`}
    >
      <div className="relative">{children}</div>
    </div>
  );
};

export default SelectionTracker;
