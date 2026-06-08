import React from "react";

interface CustomInputProps {
  label?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  icon?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  name,
  type = "text",
  placeholder,
  icon,
  value,
  onChange,
  disabled,
}) => {
  return (
    <div className="w-full flex flex-col gap-1 mt-2">
      <div className="flex items-center justify-between">
        <label
          className={`text-sm font-medium ${
            disabled ? "text-gray-400" : "text-gray-700"
          }`}
        >
          {label}
        </label>
        {disabled && (
          <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Read only
          </span>
        )}
      </div>

      <div
        className={`flex items-center border rounded-md overflow-hidden transition-all ${
          disabled
            ? "border-gray-200 bg-gray-50"
            : "border-gray-300 bg-white focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100"
        }`}
      >
        {icon && (
          <div className="px-3">
            <img
              src={icon}
              alt="icon"
              className={`w-5 h-5 ${disabled ? "opacity-30" : "opacity-75"}`}
            />
          </div>
        )}

        {disabled && (
          <div className="pl-3 pr-1 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-gray-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        )}

        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full px-3 py-3 outline-none text-sm selection:bg-transparent selection:text-black ${
            disabled
              ? "bg-gray-50 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-800"
          }`}
        />
      </div>
    </div>
  );
};

export default CustomInput;