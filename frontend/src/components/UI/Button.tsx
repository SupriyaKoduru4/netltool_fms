import { cva } from "class-variance-authority";

const buttonStyles = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "font-medium tracking-tight",
    "rounded-lg cursor-pointer",
    "transition-all duration-150",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1",
  ],
  {
    variants: {
      variant: {
        // Filled
        primary:
          "bg-[#0f0f0f] text-white hover:bg-[#2a2a2a] active:scale-[0.98] shadow-sm",
        secondary:
          "bg-gray-100 text-gray-800 hover:bg-gray-200 active:scale-[0.98]",
        danger:
          "bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400 active:scale-[0.98]",
        ghost:
          "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:scale-[0.98]",

        // Outline
        outline:
          "bg-transparent border border-gray-300 text-gray-700 hover:border-gray-500 hover:text-gray-900 active:scale-[0.98]",
        outlineDark:
          "bg-transparent border border-[#0f0f0f] text-[#0f0f0f] hover:bg-[#0f0f0f] hover:text-white active:scale-[0.98]",

        // Legacy aliases (keep existing usage working)
        long: "bg-[#0f0f0f] text-white hover:bg-[#2a2a2a] active:scale-[0.98] shadow-sm",
        longOutline:
          "bg-transparent border border-gray-300 text-gray-700 hover:border-gray-500 hover:text-gray-900 active:scale-[0.98]",
      },

      size: {
        xs: "text-xs px-2.5 py-1.5 rounded-md",
        sm: "text-xs px-3.5 py-2",
        md: "text-sm px-4 py-2.5",
        lg: "text-sm px-6 py-3",
        xl: "text-base px-8 py-3.5",

        // icon-only sizes
        iconXs: "text-xs p-1.5 rounded-md",
        iconSm: "text-sm p-2",
        iconMd: "text-sm p-2.5",
        iconLg: "text-base p-3",
      },

      wide: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      wide: false,
    },
  }
);

interface ButtonProps {
  text?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  onClick?: () => void;
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "ghost"
    | "outline"
    | "outlineDark"
    | "long"
    | "longOutline";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "iconXs" | "iconSm" | "iconMd" | "iconLg";
  wide?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button = ({
  text,
  icon,
  iconPosition = "left",
  onClick,
  variant,
  size,
  wide,
  disabled,
  type = "button",
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, wide })}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && iconPosition === "left" && (
        <span className="shrink-0">{icon}</span>
      )}
      {text && <span>{text}</span>}
      {icon && iconPosition === "right" && (
        <span className="shrink-0">{icon}</span>
      )}
    </button>
  );
};

export default Button;