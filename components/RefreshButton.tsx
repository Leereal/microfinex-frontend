import React from "react";

interface RefreshButtonProps {
  onRefresh: () => void; // Function to call on refresh
  label?: string; // Optional label for the button
  icon?: string; // Optional icon class
}

const RefreshButton: React.FC<RefreshButtonProps> = ({
  onRefresh,
  label = "Refresh",
  icon = "pi pi-sync",
}) => {
  return (
    <span
      className="font-semibold cursor-pointer text-green-400"
      onClick={onRefresh}
    >
      <i className={`${icon} mx-3`}></i>
      {label}
    </span>
  );
};

export default RefreshButton;
