import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Note } from '../../types';
import { GlassCard } from '../../components/common/GlassCard';
import { GlitchHeading } from '../../components/common/GlitchHeading';
import { Button } from '../../components/common/Button';
import { Pin, Trash2, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotesPage() {
    const { user } = useAuth();
    const [notes, setNotes] = useState<Note[]>([]);
    const [isCreating, setIsCreating] = useState(false);

    // Note Form State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState('');

    useEffect(() => {
        fetchNotes();
    }, [user]);

    const fetchNotes = async () => {
        if (!user) return;
        const { data } = await supabase
            .from('notes')
            .select('*')
            .eq('user_id', user.id)
            .order('is_pinned', { ascending: false })
            .order('created_at', { ascending: false });

        if (data) setNotes(data);
    };

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && currentTag.trim()) {
            e.preventDefault();
            if (!tags.includes(currentTag.trim())) {
                setTags([...tags, currentTag.trim()]);
            }
            setCurrentTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const createNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const { data, error } = await supabase
            .from('notes')
            .insert([{
                user_id: user.id,
                title,
                content,
                tags,
                is_pinned: false
            }])
            .select()
            .single();

        if (!error && data) {
            setNotes([data, ...notes]);
            setIsCreating(false);
            resetForm();
        }
    };

    const deleteNote = async (id: string) => {
        const { error } = await supabase.from('notes').delete().eq('id', id);
        if (!error) {
            setNotes(notes.filter(n => n.id !== id));
        }
    };

    const togglePin = async (note: Note) => {
        const { data, error } = await supabase
            .from('notes')
            .update({ is_pinned: !note.is_pinned })
            .eq('id', note.id)
            .select()
            .single();

        if (!error && data) {
            // Optimistic update or refetch
            const updatedNotes = notes.map(n => n.id === note.id ? data : n);
            // Re-sort: pinned first
            updatedNotes.sort((a, b) => (Number(b.is_pinned) - Number(a.is_pinned)));
            setNotes(updatedNotes);
        }
    };

    const resetForm = () => {
        setTitle('');
        setContent('');
        setTags([]);
        setCurrentTag('');
    };

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <GlitchHeading className="text-3xl md:text-4xl mb-2">My Notes</GlitchHeading>
                    <p className="text-zinc-400">Capture your dreams & thoughts.</p>
                </div>
                <Button onClick={() => setIsCreating(!isCreating)} variant={isCreating ? 'secondary' : 'primary'}>
                    {isCreating ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    {isCreating ? 'Cancel' : 'New Note'}
                </Button>
            </header>

            {/* Create Note Form */}
            <AnimatePresence>
                {isCreating && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <GlassCard glow className="mb-8 border-primary/20">
                            <form onSubmit={createNote} className="space-y-4">
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Note Title"
                                    className="w-full bg-transparent text-xl font-bold placeholder:text-zinc-600 border-b border-white/10 pb-2 focus:outline-none focus:border-primary transition-colors"
                                    required
                                />
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Write your thoughts..."
                                    className="w-full bg-transparent min-h-[100px] placeholder:text-zinc-600 focus:outline-none resize-none"
                                    required
                                />

                                {/* Tags Input */}
                                <div className="flex flex-wrap gap-2 items-center">
                                    {tags.map(tag => (
                                        <span key={tag} className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                            #{tag}
                                            <button type="button" onClick={() => removeTag(tag)} className="hover:text-white"><X className="w-3 h-3" /></button>
                                        </span>
                                    ))}
                                    <input
                                        value={currentTag}
                                        onChange={(e) => setCurrentTag(e.target.value)}
                                        onKeyDown={handleAddTag}
                                        placeholder="Add tags (press Enter)"
                                        className="bg-transparent text-sm text-zinc-400 placeholder:text-zinc-700 focus:outline-none min-w-[150px]"
                                    />
                                </div>

                                <div className="flex justify-end pt-2">
                                    <Button type="submit">Save Note</Button>
                                </div>
                            </form>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Notes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.length === 0 && !isCreating && (
                    <div className="col-span-full text-center py-12 text-zinc-500">
                        You haven't written any notes yet.
                    </div>
                )}

                {notes.map(note => (
                    <GlassCard key={note.id} className={cn("group flex flex-col h-full", note.is_pinned && "border-secondary/30 bg-secondary/5")}>
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="text-lg font-bold line-clamp-1">{note.title}</h3>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => togglePin(note)}
                                    className={cn("p-1.5 rounded-md transition-colors", note.is_pinned ? "text-secondary bg-secondary/10" : "text-zinc-500 hover:bg-white/5")}
                                    title="Pin Note"
                                >
                                    <Pin className="w-4 h-4 fill-current" />
                                </button>
                                <button
                                    onClick={() => deleteNote(note.id)}
                                    className="p-1.5 rounded-md text-zinc-500 hover:text-red-400 hover:bg-white/5 transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <p className="text-zinc-400 text-sm mb-4 line-clamp-4 flex-grow whitespace-pre-wrap">{note.content}</p>

                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex gap-2 flex-wrap">
                                {note.tags?.map(tag => (
                                    <span key={tag} className="text-[10px] text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">#{tag}</span>
                                ))}
                            </div>
                            <span className="text-[10px] text-zinc-600">
                                {format(new Date(note.created_at), 'MMM d')}
                            </span>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
}
