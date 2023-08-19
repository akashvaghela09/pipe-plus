import { config } from "../configs/config";
import axios from "axios";
import { shuffleArray } from "../utils";

export const feed = {
    trending: async (region) => {
        let data = null;

        try {
            let res = await axios.get(`${config.baseUrl}/trending?region=${region}`)
            data = [...res.data];
        } catch (error) {
            console.log("Failed while fetching trending data", error);
        }

        return data;
    },

    suggestions: async (query) => {
        let data = null;

        try {
            let res = await axios.get(`${config.baseUrl}/suggestions?query=${query}`);
            data = [...res?.data];
        } catch (error) {
            console.log("Failed while fetching suggestions", error);
        }

        return data;
    },

    search: async (query, filter = "all") => {
        let data = null;

        try {
            let res = await axios.get(`${config.baseUrl}/search?q=${query}&filter=${filter}`);
            data = { ...res.data };
        } catch (error) {
            console.log("Failed while fetching search data", error);
        }

        return data;
    },

    dummy: async () => {
        let data = null;

        let channelList = [
            "UC4QZ_LsYcvcq7qOsOhpAX4A",
            "UCtZO3K2p8mqFwiKWb9k7fXA",
            "UCH4BNI0-FOK2dMXoFtViWHw",
            "UCsooa4yRKGN_zEE8iknghZA",
            "UCsXVk37bltHxD1rDPwtNM8Q"
        ]

        try {
            let res = await axios.get(`${config.baseUrl}/feed/unauthenticated?channels=${channelList.join(",")}`);
            data = [...res.data];
        } catch (error) {
            console.log("Failed while fetching dummy feed data", error);
        }

        return data;
    },

    subscriptionBased: async (channelList) => {
        let data = null;

        try {
            let res = await axios.get(`${config.baseUrl}/feed/unauthenticated?channels=${channelList.join(",")}`);
            data = [...res.data];
        } catch (error) {
            console.log("Failed while fetching user feed data", error);
        }

        return data;
    },

    suggestionBased: async (channelList) => {
        try {
            if (channelList.length === 0) return { success: false, message: "No channels found" };
            if (channelList.length > 20) { 
                // Shuffle before slicing
                channelList = shuffleArray(channelList);
                // Limiting the number of channels to 20
                channelList = channelList.slice(0, 20) 
            };   

            let feedStreams = [];
            let suggestionStreamList = [];

            let subscriptionBasedFeed = await axios.get(`${config.baseUrl}/feed/unauthenticated?channels=${channelList.join(",")}`);
            feedStreams = shuffleArray(subscriptionBasedFeed.data);

            let channelPromises = channelList.map(async channel => {
                let channelRes = await axios.get(`${config.baseUrl}/channel/${channel}`)
                let channelStream = channelRes.data.relatedStreams[0];
                let streamId = channelStream.url.split("=")[1];

                let streamRes = await axios.get(`${config.baseUrl}/streams/${streamId}`);
                let relataedStreams = streamRes.data.relatedStreams;
                let streamOnlyList = relataedStreams.filter(item => item.type === "stream");
                let uploaderIds = streamOnlyList.map(item => {
                        let uploaderId = item.uploaderUrl.split("/channel/").pop();
                        return uploaderId;
                    });
                suggestionStreamList.push(...uploaderIds.slice(0, 5));
            });
            
            // Use Promise.all to wait for all promises to resolve
            await Promise.all(channelPromises);

            // remove duplicates
            suggestionStreamList = [...new Set(suggestionStreamList)];

            let shuffledChannels = shuffleArray(suggestionStreamList).slice(0, 30);

            let relatedRes = await axios.get(`${config.baseUrl}/feed/unauthenticated?channels=${shuffledChannels.join(",")}`);
            let allowedSuggestions = Math.ceil(feedStreams.length * 0.40);
            let suggestionBasedFeed = shuffleArray(relatedRes.data);

            let finalFeed = shuffleArray([...feedStreams, ...suggestionBasedFeed.slice(0, allowedSuggestions)]);

            return { success: true, data: finalFeed };
        } catch (error) {
            console.log("Failed while fetching user feed data", error);
            return { success: false, message: "Failed while fetching user feed data" };
        }
    }
};

