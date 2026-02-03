import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    glow?: boolean;
}

export function GlassCard({ children, className, glow = false, ...props }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={cn(
                "glass-card p-6 relative overflow-hidden",
                glow && "hover:shadow-[0_0_20px_rgba(109,40,217,0.3)] transition-shadow duration-300",
                className
            )}
            {...props}
        >
            {glow && (
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/20 blur-3xl rounded-full pointer-events-none" />
            )}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}
