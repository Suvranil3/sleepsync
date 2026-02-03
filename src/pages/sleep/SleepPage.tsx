import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { SleepLog } from '../../types';
import { GlassCard } from '../../components/common/GlassCard';
import { GlitchHeading } from '../../components/common/GlitchHeading';
import { Button } from '../../components/common/Button';
import { Moon, Sun, Play, StopCircle, Trash2 } from 'lucide-react';
import { format, differenceInMinutes } from 'date-fns';

export default function SleepPage() {
    const { user } = useAuth();
    const [logs, setLogs] = useState<SleepLog[]>([]);
    const [activeSession, setActiveSession] = useState<SleepLog | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, [user]);

    const fetchLogs = async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('sleep_logs')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setLogs(data);
            // Check if the most recent log is incomplete (sleeping)
            const latest = data[0];
            if (latest && latest.sleep_start && !latest.wake_end) {
                setActiveSession(latest);
            } else {
                setActiveSession(null);
            }
        }
        setLoading(false);
    };

    const startSleep = async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('sleep_logs')
            .insert([{
                user_id: user.id,
                sleep_start: new Date().toISOString(),
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (!error && data) {
            setLogs([data, ...logs]);
            setActiveSession(data);
        }
    };

    const wakeUp = async () => {
        if (!activeSession || !user) return;
        const endTime = new Date();
        const startTime = new Date(activeSession.sleep_start!);
        const duration = differenceInMinutes(endTime, startTime);

        const { data, error } = await supabase
            .from('sleep_logs')
            .update({
                wake_end: endTime.toISOString(),
                duration_minutes: duration
            })
            .eq('id', activeSession.id)
            .select()
            .single();

        if (!error && data) {
            setLogs(logs.map(l => l.id === activeSession.id ? data : l));
            setActiveSession(null);
        }
    };

    const deleteLog = async (id: string) => {
        const { error } = await supabase.from('sleep_logs').delete().eq('id', id);
        if (!error) {
            setLogs(logs.filter(l => l.id !== id));
            if (activeSession?.id === id) setActiveSession(null);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <GlitchHeading className="text-3xl md:text-4xl mb-2">Sleep Log</GlitchHeading>
                    <p className="text-zinc-400">Track your rest cycles.</p>
                </div>
            </header>

            {/* Controller */}
            <GlassCard glow className="flex flex-col md:flex-row items-center justify-between gap-6 py-8">
                <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${activeSession ? 'bg-primary animate-pulse' : 'bg-zinc-800'}`}>
                        {activeSession ? <Moon className="w-8 h-8 text-white" /> : <Sun className="w-8 h-8 text-zinc-500" />}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">
                            {activeSession ? 'Currently Sleeping' : 'Ready to Sleep?'}
                        </h2>
                        <p className="text-zinc-400 text-sm">
                            {activeSession
                                ? `Started at ${format(new Date(activeSession.sleep_start!), 'h:mm a')}`
                                : 'Log your session to sync your data.'}
                        </p>
                    </div>
                </div>

                <div className="w-full md:w-auto">
                    {!activeSession ? (
                        <Button onClick={startSleep} size="lg" className="w-full md:w-auto gap-2">
                            <Moon className="w-4 h-4" /> Start Sleeping
                        </Button>
                    ) : (
                        <Button onClick={wakeUp} variant="secondary" size="lg" className="w-full md:w-auto gap-2">
                            <Sun className="w-4 h-4" /> I'm Awake
                        </Button>
                    )}
                </div>
            </GlassCard>

            {/* History List */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-zinc-300">History</h3>
                {logs.length === 0 && !loading && (
                    <p className="text-zinc-500 text-center py-8">No sleep logs found.</p>
                )}

                {logs.map(log => (
                    <GlassCard key={log.id} className="flex items-center justify-between p-4 py-3 bg-zinc-900/30">
                        <div className="flex items-center gap-4">
                            <div className="text-center min-w-[60px]">
                                <div className="text-lg font-bold text-white">
                                    {format(new Date(log.created_at), 'd')}
                                </div>
                                <div className="text-xs text-zinc-500 uppercase">
                                    {format(new Date(log.created_at), 'MMM')}
                                </div>
                            </div>
                            <div className="h-10 w-px bg-white/10" />
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-zinc-300">
                                        {log.sleep_start ? format(new Date(log.sleep_start), 'h:mm a') : '?'}
                                    </span>
                                    <span className="text-zinc-600">-</span>
                                    <span className="text-sm text-zinc-300">
                                        {log.wake_end ? format(new Date(log.wake_end), 'h:mm a') : 'Now'}
                                    </span>
                                </div>
                                <div className="text-xs text-zinc-500 mt-0.5">
                                    {log.duration_minutes ? `${Math.floor(log.duration_minutes / 60)}h ${log.duration_minutes % 60}m` : 'Ongoing'}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => deleteLog(log.id)}
                            className="p-2 text-zinc-600 hover:text-red-400 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
}
