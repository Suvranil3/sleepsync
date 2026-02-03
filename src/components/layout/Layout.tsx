import { Navbar } from './Navbar';
import { Toaster } from 'react-hot-toast'; // We might need to install this or build our own
import { useAuth } from '../../hooks/useAuth';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const { user } = useAuth();
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 selection:text-white">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[120px]" />
            </div>

            {/* Only show Navbar if logged in, handled inside Navbar but wrapper is nice */}
            {user && <Navbar />}

            <main className="relative z-10 flex-1 container mx-auto px-4 py-8 pb-20 md:pb-8 mt-16 md:mt-20">
                {children}
            </main>
        </div>
    );
}
