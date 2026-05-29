import { useRef, useEffect } from "react";

interface CustomTextareaProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  autoResize?: boolean;
}

function CustomTextarea({
  value,
  onChange,
  label,
  placeholder = "Type something...",
  error,
  disabled = false,
  rows = 4,
  maxLength,
  autoResize = false,
}: CustomTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value, autoResize]);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {/* Label */}
      {label && (
        <label className="text-xs font-medium text-gray-600 tracking-wide">
          {label}
        </label>
      )}

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={autoResize ? 1 : rows}
        maxLength={maxLength}
        className={[
          "w-full px-3 py-2.5 rounded-lg border bg-white",
          "text-sm text-gray-900 placeholder:text-gray-400",
          "transition-all duration-150 resize-none",
          "focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1",
          autoResize ? "overflow-hidden" : "overflow-y-auto",
          error
            ? "border-red-300 focus:ring-red-200"
            : "border-gray-200 hover:border-gray-400 focus:border-gray-400",
          disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : "",
        ].join(" ")}
      />

      {/* Footer: error or char count */}
      <div className="flex items-center justify-between min-h-[16px]">
        {error ? (
          <p className="text-xs text-red-500 tracking-wide">{error}</p>
        ) : (
          <span />
        )}
        {maxLength && (
          <span
            className={`text-xs tabular-nums ${
              value.length >= maxLength
                ? "text-red-400"
                : value.length >= maxLength * 0.85
                ? "text-yellow-500"
                : "text-gray-400"
            }`}
          >
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}

export default CustomTextarea;