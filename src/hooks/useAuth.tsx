import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    profile: Profile | null;
    loading: boolean; // Initial load (session check)
    userLoading: boolean; // Loading during operations
    signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signUp: (email: string, password: string) => Promise<{ error: AuthError | null; data: { user: User | null; session: Session | null } }>;
    signOut: () => Promise<void>;
    updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [userLoading, setUserLoading] = useState(false);

    useEffect(() => {
        // Check active session
        const initSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                await fetchProfile(session.user.id);
            }
            setLoading(false);
        };

        initSession();

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                await fetchProfile(session.user.id);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (data) {
            setProfile(data);
        } else if (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const updateProfile = async (updates: Partial<Profile>) => {
        if (!user) return { error: 'No user' };

        const { error } = await supabase
            .from('profiles')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', user.id);

        if (!error) {
            setProfile(prev => prev ? { ...prev, ...updates } : null);
        }
        return { error };
    };

    const signIn = async (email: string, password: string) => {
        setUserLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setUserLoading(false);
        return { error };
    };

    const signUp = async (email: string, password: string) => {
        setUserLoading(true);
        // 1. Sign up the user
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setUserLoading(false);
            return { data, error };
        }

        // 2. Create the profile row if user was created
        if (data.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([{
                    id: data.user.id,
                    username: email.split('@')[0], // Default username
                }]);

            if (profileError) {
                console.error("Error creating profile:", profileError);
                // Note: We don't block access if profile fail, but we ideally should.
                // In a production app, a DB trigger is safer.
            }
        }

        setUserLoading(false);
        return { data, error };
    };

    const signOut = async () => {
        setUserLoading(true);
        await supabase.auth.signOut();
        setProfile(null);
        setUserLoading(false);
    };

    const value = {
        user,
        session,
        profile,
        loading,
        userLoading,
        signIn,
        signUp,
        signOut,
        updateProfile
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
