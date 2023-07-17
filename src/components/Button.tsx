import { ReactNode } from "react";

type ButtonProps = {
  icon?: JSX.Element;
  value: ReactNode;
  fullWidth?: boolean;
  variant?: "solid" | "outline";
  onClick?: () => any;
};

export const Button = ({
  icon,
  value,
  onClick,
  fullWidth = false,
  variant = "solid",
}: ButtonProps) => {
  return (
    <button
      className={`flex items-center justify-center gap-1 py-2 px-4 rounded-md cursor-pointer  transition-all border border-slate-700 ${
        fullWidth ? "w-full" : "w-max"
      } ${
        variant === "solid"
          ? "bg-slate-700 hover:bg-slate-800"
          : " hover:bg-zinc-800"
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{value}</span>
    </button>
  );
};
