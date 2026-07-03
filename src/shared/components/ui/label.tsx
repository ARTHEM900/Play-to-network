import * as React from "react"
import { cn } from "@/shared/utils/utils"

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-xs font-bold text-white/70 uppercase tracking-widest select-none",
          className
        )}
        {...props}
      />
    )
  }
)
Label.displayName = "Label"

export { Label }
