import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { GlitchHeading } from '../components/common/GlitchHeading';
import { GlassCard } from '../components/common/GlassCard';
import { Moon, Activity, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
    const { user, loading } = useAuth();

    if (loading) return null;
    if (user) return <Navigate to="/app" replace />;

    return (
        <div className="min-h-screen relative overflow-hidden bg-background text-white selection:bg-secondary/30">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary/10 blur-[100px] rounded-full pointer-events-none" />

            {/* Header */}
            <nav className="relative z-10 container mx-auto px-6 py-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Moon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl">SleepSync</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">Log In</Link>
                    <Link to="/register">
                        <Button size="sm">Get Started</Button>
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <div className="relative z-10 container mx-auto px-6 pt-20 pb-32">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-secondary mb-6 hover:bg-white/10 transition-colors cursor-default">
                            <Zap className="w-3 h-3" />
                            <span>v1.0 Now Live</span>
                        </div>
                        <GlitchHeading className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
                            Sync your sleep,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-300% animate-gradient">
                                Master your potential.
                            </span>
                        </GlitchHeading>
                        <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            The premium sleep tracker for high-performers.
                            Visualize your rest, identify patterns, and optimize your wakefulness with SleepSync.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/register">
                                <Button size="lg" className="min-w-[160px] h-14 text-lg">Start Tracking Free</Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="outline" size="lg" className="min-w-[160px] h-14 text-lg bg-transparent hover:bg-white/5">
                                    Existing User
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Feature Grid Visual */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
                    >
                        <GlassCard className="bg-zinc-900/40">
                            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 text-primary">
                                <Moon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Smart Tracking</h3>
                            <p className="text-zinc-400">Log sleep cycles with a single tap. Analyze duration and quality metrics effortlessly.</p>
                        </GlassCard>
                        <GlassCard className="bg-zinc-900/40">
                            <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4 text-secondary">
                                <Activity className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Daily Insights</h3>
                            <p className="text-zinc-400">Get data-driven insights about your rest patterns to improve your energy levels.</p>
                        </GlassCard>
                        <GlassCard className="bg-zinc-900/40">
                            <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Premium UI</h3>
                            <p className="text-zinc-400">Experience a distraction-free, dark-mode first interface designed for night owls.</p>
                        </GlassCard>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
