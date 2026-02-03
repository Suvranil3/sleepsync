import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { SleepLog, Note } from '../types';
import { GlassCard } from '../components/common/GlassCard';
import { GlitchHeading } from '../components/common/GlitchHeading';
import { Button } from '../components/common/Button';
import { Moon, Sun, Clock, Pin, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, differenceInHours, differenceInMinutes } from 'date-fns';

export default function Dashboard() {
    const { user } = useAuth();
    const [lastSleep, setLastSleep] = useState<SleepLog | null>(null);
    const [pinnedNotes, setPinnedNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            // Fetch most recent sleep log
            const { data: sleepData } = await supabase
                .from('sleep_logs')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            // Fetch pinned notes
            const { data: notesData } = await supabase
                .from('notes')
                .select('*')
                .eq('user_id', user.id)
                .eq('is_pinned', true)
                .order('updated_at', { ascending: false })
                .limit(3);

            if (sleepData) setLastSleep(sleepData);
            if (notesData) setPinnedNotes(notesData);
            setLoading(false);
        };

        fetchData();
    }, [user]);

    const formatDuration = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };

    return (
        <div className="space-y-8">
            <header>
                <GlitchHeading className="text-3xl md:text-4xl mb-2">
                    Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'},
                    <span className="text-primary ml-2">{user?.email?.split('@')[0]}</span>
                </GlitchHeading>
                <p className="text-zinc-400">Here's your sleep sync overview.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Sleep Summary Card */}
                <GlassCard glow className="col-span-1 md:col-span-2 lg:col-span-2">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Moon className="w-5 h-5 text-primary" />
                                Last Sleep Session
                            </h3>
                            <p className="text-zinc-500 text-sm mt-1">
                                {lastSleep?.created_at
                                    ? format(new Date(lastSleep.created_at), 'EEEE, MMMM do')
                                    : 'No entries yet'}
                            </p>
                        </div>
                        <Link to="/sleep">
                            <Button size="sm" variant="outline">View History</Button>
                        </Link>
                    </div>

                    {!lastSleep ? (
                        <div className="text-center py-8 text-zinc-500 bg-white/5 rounded-lg border border-white/5 border-dashed">
                            No sleep data recorded yet.
                            <div className="mt-4">
                                <Link to="/sleep"><Button>Start Tracking</Button></Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-zinc-900/50 p-4 rounded-lg border border-white/5">
                                <span className="text-xs text-zinc-500 uppercase tracking-widest block mb-1">Duration</span>
                                <span className="text-2xl font-bold text-white">
                                    {lastSleep.duration_minutes ? formatDuration(lastSleep.duration_minutes) : '--'}
                                </span>
                            </div>
                            <div className="bg-zinc-900/50 p-4 rounded-lg border border-white/5">
                                <div className="flex items-center gap-2 mb-1">
                                    <Moon className="w-3 h-3 text-indigo-400" />
                                    <span className="text-xs text-zinc-500 uppercase tracking-widest">Bedtime</span>
                                </div>
                                <span className="text-lg font-medium text-white">
                                    {lastSleep.sleep_start ? format(new Date(lastSleep.sleep_start), 'h:mm a') : '--'}
                                </span>
                            </div>
                            <div className="bg-zinc-900/50 p-4 rounded-lg border border-white/5">
                                <div className="flex items-center gap-2 mb-1">
                                    <Sun className="w-3 h-3 text-amber-400" />
                                    <span className="text-xs text-zinc-500 uppercase tracking-widest">Wake Up</span>
                                </div>
                                <span className="text-lg font-medium text-white">
                                    {lastSleep.wake_end ? format(new Date(lastSleep.wake_end), 'h:mm a') : 'Sleeping...'}
                                </span>
                            </div>
                        </div>
                    )}
                </GlassCard>

                {/* Quick Actions / Stats */}
                <GlassCard className="flex flex-col justify-center gap-4">
                    <h3 className="text-lg font-bold mb-2">Quick Actions</h3>
                    <Link to="/sleep" className="w-full">
                        <Button className="w-full justify-start gap-2" variant="secondary">
                            <Moon className="w-4 h-4" />
                            Log Sleep
                        </Button>
                    </Link>
                    <Link to="/notes" className="w-full">
                        <Button className="w-full justify-start gap-2" variant="outline">
                            <Plus className="w-4 h-4" />
                            New Note
                        </Button>
                    </Link>
                </GlassCard>

                {/* Pinned Notes */}
                <div className="col-span-1 md:col-span-3">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Pin className="w-5 h-5 text-secondary" />
                            Pinned Notes
                        </h3>
                        <Link to="/notes">
                            <Button size="sm" variant="ghost">View All</Button>
                        </Link>
                    </div>

                    {pinnedNotes.length === 0 ? (
                        <div className="text-zinc-500 italic text-sm">No pinned notes.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {pinnedNotes.map(note => (
                                <GlassCard key={note.id} className="min-h-[120px] cursor-pointer hover:border-secondary/50 transition-colors">
                                    <h4 className="font-bold text-lg mb-2 truncate">{note.title}</h4>
                                    <p className="text-zinc-400 text-sm line-clamp-3">{note.content}</p>
                                    <div className="mt-3 flex gap-2">
                                        {note.tags?.map(tag => (
                                            <span key={tag} className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-zinc-300">#{tag}</span>
                                        ))}
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
