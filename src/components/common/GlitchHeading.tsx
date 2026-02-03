import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlitchHeadingProps {
    children: React.ReactNode;
    className?: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span';
}

export function GlitchHeading({ children, className, as: Component = 'h1' }: GlitchHeadingProps) {
    return (
        <div className="relative inline-block group">
            <Component className={cn("relative z-10 font-bold", className)}>
                {children}
            </Component>
            <Component
                className={cn(
                    "absolute top-0 left-0 -z-10 opacity-0 group-hover:opacity-100 group-hover:animate-glitch text-primary blur-[1px]",
                    className
                )}
                aria-hidden="true"
            >
                {children}
            </Component>
            <Component
                className={cn(
                    "absolute top-0 left-0 -z-10 opacity-0 group-hover:opacity-100 group-hover:animate-glitch text-secondary blur-[1px]",
                    className
                )}
                style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
                aria-hidden="true"
            >
                {children}
            </Component>
        </div>
    );
}
