import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/**
 * Hairline field: quiet container fill, a single border that warms to gold on
 * focus, label set in the small caps of the label face.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block font-label text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-on-surface-variant"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-11 w-full rounded border border-line bg-surface-container px-4",
            "text-sm text-on-surface placeholder:text-on-surface-variant/50",
            "transition-colors duration-[var(--theme-duration-fast)] ease-entrance",
            "hover:border-line-strong",
            "focus:border-secondary focus:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-error focus:border-error",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input, type InputProps };
