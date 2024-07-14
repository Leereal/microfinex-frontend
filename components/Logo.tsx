import React from "react";
import { useGetGlobalSettingsQuery } from "@/redux/features/globalSettingsApiSlice";

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  text?: string;
  disableText?: boolean;
  layout?: "horizontal" | "vertical"; // New prop for layout
}

const sizeClasses: Record<
  string,
  { text: string; width: number; height: number }
> = {
  xs: { text: "text-[18.67px]", width: 24, height: 24 },
  sm: { text: "text-[23.33px]", width: 30, height: 30 },
  md: { text: "text-[28px]", width: 36, height: 36 },
  lg: { text: "text-[65.34px]", width: 82, height: 82 },
  xl: { text: "text-[98px]", width: 120, height: 120 },
};

const Logo: React.FC<LogoProps> = ({
  size = "md",
  text,
  disableText = false,
  layout = "horizontal", // Default layout
}) => {
  const { data: globalSettings } = useGetGlobalSettingsQuery();
  const mediaUrl = globalSettings && globalSettings[0]?.company_logo;
  const defaultText =
    (globalSettings && globalSettings[0]?.company_name?.toUpperCase()) ||
    "MICROFINEX";
  const { text: textSize, width, height } = sizeClasses[size];

  return (
    <div
      className={`flex ${
        layout === "vertical" ? "flex-col items-center" : "items-center"
      }`}
    >
      <img
        src={mediaUrl || "/favicon.png"}
        width={width}
        height={height}
        alt="logo"
        className={`mr-2 ${layout === "vertical" ? "mb-2" : ""}`} // Adjust margin for vertical layout
      />
      {!disableText && <span className={textSize}>{text || defaultText}</span>}
    </div>
  );
};

export default Logo;
