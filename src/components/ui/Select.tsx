import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { forwardRef, type SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

/**
 * Hairline select: same skin as `Input`, with its own chevron so the control
 * reads the same in every browser and theme.
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={selectId}
            className="block font-label text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-on-surface-variant"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "h-11 w-full appearance-none rounded border border-line bg-surface-container px-4 pr-10",
              "text-sm text-on-surface",
              "transition-colors duration-[var(--theme-duration-fast)] ease-entrance",
              "hover:border-line-strong",
              "focus:border-secondary focus:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-error focus:border-error",
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant"
          />
        </div>
        {error && (
          <p className="text-sm text-error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select, type SelectProps };
