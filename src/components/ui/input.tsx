import * as React from "react";
import { cn } from "@/lib/utils";

// Define the props interface to include the ref
interface InputProps extends React.ComponentProps<"input"> {}

// Use React.forwardRef to forward the ref to the input element
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
      // Only apply this logic if the input type is "date"
      if (type === "date") {
        const inputElement = event.currentTarget;
        // Check if showPicker is supported by the browser
        if (inputElement.showPicker) {
          inputElement.showPicker();
        }
      }
      // Call the original onClick if it was passed in props
      if (props.onClick) {
        props.onClick(event);
      }
    };

    return (
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        onClick={handleClick}
        ref={ref} // Forward the ref to the input element
        {...props}
      />
    );
  }
);

// Set a display name for better debugging
Input.displayName = "Input";

export { Input };