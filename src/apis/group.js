import { supabase } from "../configs/supabase-config";
import { isValid } from "../utils";
import { removeDuplicates } from "../utils/helper";

export const group = {
    get: async (params) => {
        const { data, error } = await supabase
            .from('pipe_groups')
            .select()
            .eq('uuid', params.uuid)

        if (isValid(error)) {
            console.log("Failed while getting group channels", error);
            return { success: false, error };
        }

        return { success: true, data };
    },

    create: async (params) => {
        const { data, error } = await supabase
            .from('pipe_groups')
            .insert([{ ...params }])
            .select()

        if (isValid(error)) {
            console.log("Failed while adding new group", error);
            return { success: false, error };
        }

        return { success: true, data };
    },

    addItem: async (params) => {
        const getRes = await supabase
            .from('pipe_groups')
            .select()
            .eq('uuid', params.uuid)

        if (isValid(getRes?.error)) {
            console.log("Failed while getting group channels", getRes?.error);
            return { success: false, error: getRes.error };
        }

        const list = getRes?.data[0]?.url_list;
        let newList = removeDuplicates([...list, params.url]);

        const { data, error } = await supabase
            .from('pipe_groups')
            .update({ url_list: [...newList], modified_at: new Date() })
            .eq('uuid', params.uuid)
            .select()

        if (isValid(error)) {
            console.log("Failed while getting group new channels", error);
            return { success: false, error };
        }

        return { success: true, data };
    },

    rename: async (params) => {
        const { data, error } = await supabase
            .from('pipe_groups')
            .update({ name: params.name, modified_at: new Date() })
            .eq('uuid', params.uuid)
            .select()

        if (isValid(error)) {
            console.log("Failed while renaming group", error);
            return { success: false, error };
        }

        return { success: true, data };
    },

    update: async (params) => {

        let newList = removeDuplicates(params.url_list);

        const { data, error } = await supabase
            .from('pipe_groups')
            .update({ url_list: [...newList], modified_at: new Date() })
            .eq('uuid', params.uuid)
            .select()

        if (isValid(error)) {
            console.log("Failed while updating group", error);
            return { success: false, error };
        }

        return { success: true, data };
    },

    delete: async (params) => {
        const { data, error } = await supabase
            .from('pipe_groups')
            .delete()
            .eq('uuid', params.uuid)

        if (isValid(error)) {
            console.log("Failed while deleting channels", error);
            return { success: false, error };
        }

        return { success: true, data };
    },
};

