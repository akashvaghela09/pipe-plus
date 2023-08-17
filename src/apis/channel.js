import { config } from "../configs/config";
import { supabase } from "../configs/supabase-config";
import { isValid } from "../utils";
import axios from "axios";

export const channel = {
    subscribe: async (updateData) => {
        let status = {
            subscribed: false,
            countUpdated: false
        }

        // check if already subscribed
        const subRes = await supabase
            .from('pipe_subscriptions')
            .select('user_id, uploader_id')
            .eq('uploader_id', updateData.uploader_id)

        if (isValid(subRes.error)) {
            console.log("Failed while checking subscription", subRes.error);
            return { success: false, error: subRes.error, ...status }
        }

        if (subRes.data.length > 0) {
            console.log("Already subscribed");
            return status;
        }

        // subscribe to channel
        const writeRes = await supabase
            .from('pipe_subscriptions')
            .insert([
                { ...updateData }
            ])

        if (isValid(writeRes.error)) {
            console.log("Failed while subscribing", writeRes.error);
            return { success: false, error: writeRes.error, ...status }
        }

        if (writeRes.status === 201) {
            status.subscribed = true;
        } else {
            console.log("Failed while subscribing", writeRes.error);
        }

        // read subscribed count
        const readRes = await supabase
            .from('pipe_users')
            .select()
            .eq('user_id', updateData.user_id)
            .single();

        let subscribedCount = readRes.data.channels_subscribed;

        // update subscribed count
        const updateRes = await supabase
            .from('pipe_users')
            .update({ channels_subscribed: subscribedCount + 1 })
            .eq('user_id', updateData.user_id)
            .select()
            .single();

        if (isValid(updateRes.error)) {
            console.log("Failed while subscribing", updateRes.error);
            return { success: false, error: updateRes.error, ...status }
        }

        if (updateRes.status === 200) {
            status.countUpdated = true;
        }

        return { success: true, ...status };
    },

    unsubscribe: async (user_id, uploader_id) => {
        let status = {
            unsubscribed: false,
            countUpdated: false
        }

        let query = supabase
            .from('pipe_subscriptions')
            .delete('user_id')

        query = query.eq('user_id', user_id)
        query = query.eq('uploader_id', uploader_id)

        const unsubRes = await query

        if (isValid(unsubRes.error)) {
            console.log("Failed while unsubscribing", unsubRes.error);
            return { success: false, error: unsubRes.error, ...status };
        }

        if (unsubRes.status === 204) {
            status.unsubscribed = true;
        }

        // read subscribed count
        const readRes = await supabase
            .from('pipe_users')
            .select()
            .eq('user_id', user_id)
            .single();

        let subscribedCount = readRes.data.channels_subscribed;

        // update subscribed count
        const updateRes = await supabase
            .from('pipe_users')
            .update({ channels_subscribed: subscribedCount - 1 })
            .eq('user_id', user_id)
            .select()
            .single();

        if (updateRes.status === 200) {
            status.countUpdated = true;
        }

        return status;
    },

    isSubscribed: async (user_id, uploader_id) => {
        const res = await supabase
            .from('pipe_subscriptions')
            .select('user_id, uploader_id')
            .eq('user_id', user_id)
            .eq('uploader_id', uploader_id)

        if (isValid(res.error)) {
            console.log("Failed while checking subscription", res.error);
            return { success: false, error: res.error }
        }

        if (res.data.length > 0) {
            return { success: true, subscribed: true }
        }

        return { success: true, subscribed: false }
    },

    getChannel: async (uploader_id) => {
        try {
            let res = await axios.get(`${config.baseUrl}/channel/${uploader_id}`);
            if (res.status === 200) {
                return { success: true, data: res.data }
            }
        } catch (error) {
            console.log("Failed while getting channel data", error);
            return { success: false, error: error }
        }
    },

    getNextPage: async (uploader_id, nextpage) => {
        let url = `${config.baseUrl}/nextpage/channel/${uploader_id}?nextpage=${(nextpage)}`;
        
        try {
            let res = await axios.get(url);
            if (res.status === 200) {
                return { success: true, data: res.data }
            }
        } catch (error) {
            console.log("Failed while getting more streams");
            return { success: false, error: error }
        }
    },

};

