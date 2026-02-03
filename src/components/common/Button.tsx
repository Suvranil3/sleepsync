import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {

        const variants = {
            primary: "bg-primary text-white hover:bg-primary/90 shadow-[0_0_15px_rgba(109,40,217,0.4)] hover:shadow-[0_0_25px_rgba(109,40,217,0.6)]",
            secondary: "bg-secondary text-white hover:bg-secondary/90 shadow-[0_0_15px_rgba(219,39,119,0.4)]",
            outline: "border border-white/20 hover:bg-white/10 text-white backdrop-blur-sm",
            ghost: "hover:bg-white/5 text-white/80 hover:text-white",
            danger: "bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30",
        };

        const sizes = {
            sm: "h-8 px-3 text-xs",
            md: "h-10 px-4 py-2",
            lg: "h-12 px-6 text-lg",
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "relative inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={disabled || isLoading}
                {...props as any} // Cast to any to avoid motion props conflict with ref
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </motion.button>
        );
    }
);
Button.displayName = "Button";
