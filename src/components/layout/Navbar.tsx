import { Link, useLocation } from 'react-router-dom';
import { Activity, Moon, StickyNote, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';
import { GlitchHeading } from '../common/GlitchHeading';

export function Navbar() {
    const location = useLocation();
    const { signOut, user } = useAuth();

    const navItems = [
        { name: 'Dashboard', path: '/app', icon: Activity },
        { name: 'Sleep Log', path: '/app/sleep', icon: Moon },
        { name: 'Notes', path: '/app/notes', icon: StickyNote },
    ];

    if (!user) return null;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/50 backdrop-blur-xl">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Moon className="w-5 h-5 text-white" />
                    </div>
                    <GlitchHeading as="span" className="text-xl font-bold tracking-tight">
                        SleepSync
                    </GlitchHeading>
                </Link>

                <div className="flex items-center gap-1 md:gap-4">
                    <div className="hidden md:flex items-center gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2",
                                    location.pathname === item.path
                                        ? "bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                                        : "text-white/60 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 border-l border-white/10 pl-2 md:pl-4">
                        <button
                            onClick={() => signOut()}
                            className="p-2 rounded-lg text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Sign Out"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-white/10 p-2 flex justify-around safe-area-bottom">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                            "flex flex-col items-center justify-center p-2 rounded-lg w-full",
                            location.pathname === item.path
                                ? "text-primary"
                                : "text-white/60"
                        )}
                    >
                        <item.icon className="w-5 h-5 mb-1" />
                        <span className="text-[10px] uppercase tracking-wider">{item.name}</span>
                    </Link>
                ))}
            </div>
        </nav>
    );
}
