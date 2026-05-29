import { RiCheckLine } from "react-icons/ri";

interface RadioOption {
  id: string | number;
  value: string;
  label: string;
  description?: string;
}

interface CustomRadioProps {
  options: RadioOption[];
  value?: RadioOption | null;
  onChange: (option: RadioOption) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  orientation?: "vertical" | "horizontal";
  variant?: "default" | "card";
}

function CustomRadio({
  options,
  value,
  onChange,
  label,
  error,
  disabled = false,
  orientation = "vertical",
  variant = "default",
}: CustomRadioProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full mt-2">
      {/* Label */}
      {label && (
        <label className="text-xs font-medium text-gray-600 tracking-wide">
          {label}
        </label>
      )}

      {/* Options */}
      <div
        className={[
          "flex gap-2",
          orientation === "horizontal" ? "flex-row flex-wrap" : "flex-col",
        ].join(" ")}
      >
        {options.map((option) => {
          const isSelected = value?.id === option.id;

          if (variant === "card") {
            return (
              <button
                key={option.id}
                type="button"
                disabled={disabled}
                onClick={() => !disabled && onChange(option)}
                className={[
                  "flex items-start justify-between gap-3 text-left",
                  "w-full px-4 py-3 rounded-lg border text-sm",
                  "transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1",
                  isSelected
                    ? "border-gray-400 bg-gray-50"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50",
                  disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                ].join(" ")}
              >
                <div className="flex flex-col gap-0.5">
                  <span
                    className={`text-sm font-medium ${
                      isSelected ? "text-gray-900" : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </span>
                  {option.description && (
                    <span className="text-xs text-gray-400 leading-relaxed">
                      {option.description}
                    </span>
                  )}
                </div>

                {/* Custom radio circle */}
                <div
                  className={[
                    "mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center",
                    "transition-all duration-150",
                    isSelected
                      ? "border-gray-800 bg-gray-800"
                      : "border-gray-300 bg-white",
                  ].join(" ")}
                >
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
              </button>
            );
          }

          // Default variant
          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onChange(option)}
              className={[
                "flex items-center gap-3 text-left",
                "w-full px-3 py-2.5 rounded-lg border bg-white text-sm",
                "transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1",
                isSelected
                  ? "border-gray-400 bg-gray-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
              ].join(" ")}
            >
              {/* Radio circle */}
              <div
                className={[
                  "w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center",
                  "transition-all duration-150",
                  isSelected
                    ? "border-gray-800 bg-gray-800"
                    : "border-gray-300 bg-white",
                ].join(" ")}
              >
                {isSelected && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>

              <div className="flex flex-col gap-0.5">
                <span
                  className={`text-sm font-medium ${
                    isSelected ? "text-gray-900" : "text-gray-700"
                  }`}
                >
                  {option.label}
                </span>
                {option.description && (
                  <span className="text-xs text-gray-400">{option.description}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 tracking-wide">{error}</p>
      )}
    </div>
  );
}

export default CustomRadio;