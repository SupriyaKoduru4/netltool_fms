import { cva } from "class-variance-authority";

const buttonStyles = cva([ "w-full", "p-3","transition-colors", "duration-300"], 
    {
        variants: {
            variant: {
                primary: "w-full bg-[#0f0f0f] text-white py-3 rounded-lg hover:bg-[#1a1a1a] transition-colors duration-300",
                secondary: "w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors duration-300",
            },
        },
        defaultVariants: {
            variant: "primary",
        },
    }
);

interface ButtonProps {
    text: string;
    onClick: () => void;
    variant?: "primary" | "secondary";
}

const Button = ({ text, onClick, variant }: ButtonProps) => {
  return (
    <button
      className={buttonStyles({ variant })}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Button;