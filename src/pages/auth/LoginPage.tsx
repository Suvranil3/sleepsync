import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { GlassCard } from '../../components/common/GlassCard';
import { Button } from '../../components/common/Button';
import { GlitchHeading } from '../../components/common/GlitchHeading';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { signIn, userLoading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const { error } = await signIn(email, password);
        if (error) {
            setError(error.message);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background elements specific to Auth */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-zinc-950 to-background z-0" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[500px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full max-w-md">
                <div className="mb-8 text-center">
                    <GlitchHeading className="text-4xl md:text-5xl mb-2">SleepSync</GlitchHeading>
                    <p className="text-zinc-400">Master your rest, master your life.</p>
                </div>

                <GlassCard glow className="border-white/5">
                    <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300 ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-zinc-900/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-zinc-600"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-zinc-900/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-zinc-600"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            isLoading={userLoading}
                        >
                            Sign In
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-zinc-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary hover:text-primary/80 transition-colors font-medium">
                            Create one
                        </Link>
                    </p>
                </GlassCard>
            </div>
        </div>
    );
}
