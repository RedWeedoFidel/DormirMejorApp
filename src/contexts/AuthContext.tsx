import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    onboardingCompleted: boolean;
    signOut: () => Promise<void>;
    refreshOnboardingStatus: () => Promise<void>;
    setOnboardingCompleted: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    onboardingCompleted: false,
    signOut: async () => { },
    refreshOnboardingStatus: async () => { },
    setOnboardingCompleted: () => { }
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [onboardingCompleted, setOnboardingCompleted] = useState(false);

    const fetchOnboardingStatus = async (userId: string) => {
        const { data } = await supabase.from('user_profiles').select('onboarding_completed').eq('id', userId).maybeSingle();
        setOnboardingCompleted(data?.onboarding_completed ?? false);
    };

    useEffect(() => {
        // Escucha cambios de sesión
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                await fetchOnboardingStatus(currentUser.id);
            }
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                await fetchOnboardingStatus(currentUser.id);
            } else {
                setOnboardingCompleted(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const refreshOnboardingStatus = async () => {
        console.log("Refreshing onboarding status for user:", user?.id);
        if (user) {
            await fetchOnboardingStatus(user.id);
            console.log("New onboarding status:", onboardingCompleted);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, onboardingCompleted, signOut, refreshOnboardingStatus, setOnboardingCompleted }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
