import { supabase } from "../configs/supabase-config";

export const getUser = async () => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        return user;
    } catch (error) {
        // Handle the error here
        console.error("Error occurred while fetching user:", error);
    }
}

export const getSession = async () => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        return session;
    } catch (error) {
        // Handle the error here
        console.error("Error occurred while fetching session:", error);
    }
}

export const signInUser = async (userEmail) => {
    try {
        const { data } = await supabase.auth.signInWithOtp({
            email: userEmail,
            options: {
                emailRedirectTo: 'https://example.com',
            },
        })

        return data;
    } catch (error) {
        console.error("Error occurred while signing in user:", error);
    }
}

export const signOutUser = async () => {
    try {
        const data = await supabase.auth.signOut();
        return data;
    } catch (error) {
        console.log("Error occurred while signing out user:", error);
    }
}

export const updateOnboardingStatus = async (user_id, email) => {
    try {
        const { data } = await supabase.auth.updateUser({ data: { onboarded: true } })

        // Add user in database
        const { res } = await supabase
            .from('pipe_users')
            .insert([
                { user_id, email, videos_watched: 0, channels_subscribed: 0, created_at: new Date(), region: "IN" },
            ])

        return { data, res };
    } catch (error) {
        console.log("Error occurred while updating onboarding status:", error);
    }
}