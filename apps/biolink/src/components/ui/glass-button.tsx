import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}

const glassButtonVariants = cva(
  "relative isolate cursor-pointer rounded-full transition-all w-full",
  {
    variants: {
      size: {
        default: "text-[15px] font-semibold min-h-[58px]",
        sm: "text-sm font-medium min-h-[44px]",
        lg: "text-lg font-medium min-h-[64px]",
        icon: "h-10 w-10 min-h-[40px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const glassButtonTextVariants = cva(
  "glass-button-text relative block select-none tracking-normal",
  {
    variants: {
      size: {
        default: "px-6 py-3.5",
        sm: "px-4 py-2",
        lg: "px-8 py-4",
        icon: "flex h-10 w-10 items-center justify-center",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  contentClassName?: string;
  href?: string;
  target?: string;
  rel?: string;
}

const GlassButton = React.forwardRef<HTMLElement, GlassButtonProps>(
  ({ className, children, size, contentClassName, href, target, rel, ...props }, ref) => {
    const Comp = href ? "a" : "button";
    return (
      <div
        className={cn(
          "glass-button-wrap cursor-pointer rounded-full",
          className
        )}
      >
        <Comp
          className={cn("glass-button", glassButtonVariants({ size }))}
          ref={ref as any}
          href={href}
          target={target}
          rel={rel}
          {...(props as any)}
        >
          <span
            className={cn(
              glassButtonTextVariants({ size }),
              contentClassName
            )}
          >
            {children}
          </span>
        </Comp>
        <div className="glass-button-shadow rounded-full"></div>
      </div>
    );
  }
);
GlassButton.displayName = "GlassButton";

export { GlassButton, glassButtonVariants };
