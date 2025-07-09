import { VariantProps } from "class-variance-authority";
import { scrollUItemVariants } from "./variants";
import { cn } from "@/lib/utils";

export interface ScrollUItemProps 
  extends React.HTMLAttributes<HTMLDivElement>, 
          VariantProps<typeof scrollUItemVariants> {
  children: React.ReactNode;
}

const ScrollUItem: React.FC<ScrollUItemProps> = ({ 
    children, 
    variant, 
    size, 
    className,
    ...props 
  }) => {
    return (
      <div 
        className={cn(scrollUItemVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </div>
    );
  };

  export { ScrollUItem}