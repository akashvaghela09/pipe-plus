import { config } from "../configs/config";
// import { supabase } from "../configs/supabase-config";
import { isValid } from "../utils";
import axios from "axios";

export const user = {
    // subscriptions: async (user_id) => {
    //     const res = await supabase
    //         .from('pipe_subscriptions')
    //         .select('*')
    //         .eq('user_id', user_id)

    //     if (isValid(res.error)) {
    //         console.log("Failed while getting list", res.error);
    //         return { success: false, error: res.error }
    //     }

    //     // Add new Avatar for channel
    //     const listPromise = res.data.map(async (item) => {
    //         let newData = { ...item };
    //         let res = await axios.get(`${config.baseUrl}/channel/${item.uploader_id}`);
    //         newData.avatar = res.data.avatarUrl;
    //         return newData;
    //     });

    //     const result = await Promise.all(listPromise);

    //     // sort in descending order, latest first based on created_at
    //     result.sort((a, b) => {
    //         return new Date(b.created_at) - new Date(a.created_at);
    //     });

    //     return { success: true, list: result }
    // }
};

