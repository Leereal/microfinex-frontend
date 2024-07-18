import CustomTooltip from "@/components/CustomTooltip";
import React from "react";

const chargeModeTemplate = ({
  mode,
  id,
}: {
  mode: string;
  id: number | string;
}) => {
  let tooltipContent = "";

  if (mode === "auto") {
    tooltipContent =
      "This means the charges will be applied automatically by the system.";
  } else if (mode === "manual") {
    tooltipContent = "This can be applied to loans by users.";
  }

  return (
    <>
      <CustomTooltip targetSelector={`.mode-${id}`} content={tooltipContent} />
      <div className={`mode-${id} capitalize`}>{mode}</div>
    </>
  );
};

export default chargeModeTemplate;
