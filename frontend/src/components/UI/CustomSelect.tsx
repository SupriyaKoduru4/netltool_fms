import { useState, useRef, useEffect } from "react";
import { RiArrowDownSLine, RiCheckLine } from "react-icons/ri";

interface SelectOption {
  id: string | number;
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value?: SelectOption | null;
  onChange: (option: SelectOption) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  error?: string;
}

function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  disabled = false,
  error,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleSelect = (option: SelectOption) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full mt-2" ref={containerRef}>
      {/* Label */}
      {label && (
        <label className="text-xs font-medium text-gray-600 tracking-wide">
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={[
          "w-full flex items-center justify-between gap-2",
          "px-3 py-2.5 rounded-lg text-sm",
          "border bg-white transition-all duration-150",
          "focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1",
          isOpen
            ? "border-gray-400 ring-2 ring-gray-200 ring-offset-1"
            : "border-gray-200 hover:border-gray-400",
          disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : "cursor-pointer",
          error ? "border-red-300 focus:ring-red-200" : "",
        ].join(" ")}
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value ? value.label : placeholder}
        </span>
        <RiArrowDownSLine
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 tracking-wide">{error}</p>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="relative z-50">
          <ul
            className={[
              "absolute top-1 left-0 w-full",
              "bg-white border border-gray-200 rounded-lg shadow-lg",
              "py-1 max-h-56 overflow-y-auto",
              "animate-in fade-in-0 zoom-in-95 duration-100",
            ].join(" ")}
          >
            {options.length === 0 ? (
              <li className="px-3 py-2.5 text-sm text-gray-400 text-center">
                No options available
              </li>
            ) : (
              options.map((option) => {
                const isSelected = value?.id === option.id;
                return (
                  <li
                    key={option.id}
                    onClick={() => handleSelect(option)}
                    className={[
                      "flex items-center justify-between gap-2",
                      "px-3 py-2.5 text-sm cursor-pointer",
                      "transition-colors duration-100",
                      isSelected
                        ? "bg-gray-50 text-gray-900 font-medium"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                    ].join(" ")}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <RiCheckLine className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CustomSelect;