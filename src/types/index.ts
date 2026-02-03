export interface SleepLog {
    id: string;
    user_id: string;
    sleep_start: string | null;
    wake_end: string | null;
    duration_minutes: number | null;
    quality_rating: number | null;
    notes: string | null;
    created_at: string;
}

export interface Note {
    id: string;
    user_id: string;
    title: string;
    content: string;
    tags: string[]; // Can be stored as JSON array or text[] in Supabase
    is_pinned: boolean;
    created_at: string;
    updated_at?: string;
}

export interface Profile {
    id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
    updated_at: string | null;
    created_at: string;
}
