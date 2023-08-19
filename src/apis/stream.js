import { config } from "../configs/config";
import axios from "axios";
import { supabase } from "../configs/supabase-config";
import { isValid } from "../utils";

export const stream = {
    get: async (streamId) => {

        let data = null;

        try {
            let res = await axios.get(`${config.baseUrl}/streams/${streamId}`);

            let resourceList = [];

            let {
                audioStreams,
                category,
                chapters,
                description,
                dislikes,
                duration,
                likes,
                livestream,
                previewFrames,
                relatedStreams,
                subtitles,
                thumbnailUrl,
                title,
                uploadDate,
                uploader,
                uploaderAvatar,
                uploaderSubscriberCount,
                uploaderUrl,
                videoStreams,
                views
            } = res.data;

            // Sort audioStreams based on bitrate/quality
            audioStreams.sort((a, b) => {
                return b.bitrate - a.bitrate;
            });

            // Extract required data from videoStreams
            videoStreams.forEach((stream) => {
                let tempObj = {
                    url: stream.url,
                    track: audioStreams[0].url,
                    mimeType: stream.mimeType,
                    quality: stream.quality,
                    videoOnly: stream.videoOnly,
                    height: stream.height,
                    width: stream.width,
                }

                resourceList.push(tempObj);
            });

            data = {
                videoStreams: [...resourceList],
                audioStreams,
                category,
                chapters,
                description,
                dislikes,
                duration,
                likes,
                livestream,
                previewFrames,
                relatedStreams,
                subtitles,
                thumbnailUrl,
                title,
                uploadDate,
                uploader,
                uploaderAvatar,
                uploaderSubscriberCount,
                uploaderUrl,
                views
            };

            return data;

        } catch (error) {
            console.log("Failed to get stream data", error);
        }
        return data;
    },

    addPlayed: async (streamData) => {
        let available = false;
        const { user_id, stream_id } = streamData;

        let query = supabase
            .from('pipe_videos')
            .select()

        query = query.eq('user_id', user_id)
        query = query.eq('stream_id', stream_id)

        const readRes = await query;

        if (isValid(readRes.error)) {
            console.log("Failed while getting stream played or not", readRes.error);
            return { success: false, error: readRes.error };
        }

        if (readRes.data.length === 0 && readRes.error === null) {
            available = false;
        } else if (readRes.data.length > 0 && readRes.error === null) {
            available = true;
        }

        if (available === false) {
            const writeRes = await supabase
                .from('pipe_videos')
                .insert([{ ...streamData }])
                .select()
            if (isValid(writeRes.error)) {
                console.log("Failed while adding new stream played", writeRes.error);
                return { success: false, error: writeRes.error };
            }

            return { success: true, data: writeRes.data, progress: writeRes.data[0].progress };
        } else if (available === true) {
            return { success: true, data: readRes.data, progress: readRes.data[0].progress };
        }
    },

    removeFromHistory: async (streamUuid) => {
        const { data, error } = await supabase
            .from('pipe_videos')
            .update({ progress: 0, watched: false })
            .eq('uuid', streamUuid)
            .select()
        if (isValid(error)) {
            console.log("Failed while removing stream from history", error);
            return { success: false, error };
        }

        return { success: true, data };
    },

    updatePlayed: async ({ streamUuid, progressAmount, watched }) => {
        const { data, error } = await supabase
            .from('pipe_videos')
            .update({ progress: progressAmount, watched: watched })
            .eq('uuid', streamUuid)
            .select()

        if (isValid(error)) {
            console.log("Failed while updating stream played", error);
            return { success: false, error };
        }

        return { success: true, data };
    },

    like: async ({ streamUuid }) => {
        const { data, error } = await supabase
            .from('pipe_videos')
            .update({ liked: true })
            .eq('uuid', streamUuid)
            .select()

        if (isValid(error)) {
            console.log("Failed while updating dislike", error);
            return { success: false, error };
        }

        return { success: true, data };
    },

    dislike: async ({ streamUuid }) => {
        const { data, error } = await supabase
            .from('pipe_videos')
            .update({ liked: false })
            .eq('uuid', streamUuid)
            .select()

        if (isValid(error)) {
            console.log("Failed while updating dislike", error);
            return { success: false, error };
        }

        return { success: true, data };
    },

    comments: {
        get: async (streamId) => {
            let data = null;

            try {
                let res = await axios.get(`${config.baseUrl}/comments/${streamId}`);
                data = res.data;
            } catch (error) {
                console.log("Failed while fetching comments", error);
            }

            return data;
        },

        getNextPage: async (streamId, nextpage) => {
            let data = null;

            try {
                let res = await axios.get(`${config.baseUrl}/nextpage/comments/${streamId}?nextpage=${nextpage}`);
                data = res.data;
            } catch (error) {
                console.log("Failed while fetching next page comments", error);
            }

            return data;
        },

        getReplies: async (commentId) => {
            let data = null;

            try {
                let res = await axios.get(`${config.baseUrl}/replies/${commentId}`);
                data = res.data;
            } catch (error) {
                console.log("Failed while fetching comment replies", error);
            }

            return data;
        },
    },

    watchLater: {
        add: async ({ streamUuid }) => {
            const { data, error } = await supabase
                .from('pipe_videos')
                .update({ watch_later: true })
                .eq('uuid', streamUuid)
                .select()

            if (isValid(error)) {
                console.log("Failed while updating watch_later", error);
                return { success: false, error };
            }

            return { success: true, data };
        },

        remove: async ({ streamUuid }) => {
            const { data, error } = await supabase
                .from('pipe_videos')
                .update({ watch_later: false })
                .eq('uuid', streamUuid)
                .select()

            if (isValid(error)) {
                console.log("Failed while updating watch_later", error);
                return { success: false, error };
            }

            return { success: true, data };

        },
    }
};

