import React from "react";
import { Tooltip } from "primereact/tooltip";

interface CustomTooltipProps {
  targetSelector: string;
  content: React.ReactNode;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  targetSelector,
  content,
}) => {
  return (
    <Tooltip
      target={targetSelector}
      position="top"
      mouseTrack
      mouseTrackLeft={5}
      mouseTrackTop={5}
    >
      <div className="bg-gray-800 text-white p-2 rounded-md w-[300px]">
        {content}
      </div>
    </Tooltip>
  );
};

export default CustomTooltip;
