import EncryptedStorage from 'react-native-encrypted-storage';
import { config } from "../configs/config";
import { isValid } from "../utils";
import axios from "axios";

export const channel = {
    subscribe: async (channelId) => {
        let returnRes = {
            success: false,
            subscribed: false,
            countUpdated: false
        }

        if(!isValid(channelId)) {
            console.log("Invalid channelId", channelId);
            return { success: false, subscribed: false };
        }

        // check if already subscribed
        const subscriptions = await EncryptedStorage.getItem("subscriptions");
        const subscriptionsCount = await EncryptedStorage.getItem("subscriptions_count");

        if (subscriptions === null) {
            console.log("Failed while getting subscriptions", subscriptions);
            return { success: false, subscribed: false };
        }

        let subscriptionStatus = subscriptions.includes(channelId);

        if(subscriptionStatus === false){
            // add to subscriptions
            let subscriptionsArr = JSON.parse(subscriptions);
            subscriptionsArr.push(channelId);
            await EncryptedStorage.setItem('subscriptions', JSON.stringify(subscriptionsArr));

            // update subscriptions count
            let subscriptionsCountInt = parseInt(subscriptionsCount);
            await EncryptedStorage.setItem('subscriptions_count', JSON.stringify(subscriptionsCountInt + 1));

            returnRes.subscribed = true;
            returnRes.countUpdated = true;
        } else if (subscriptionStatus === true) {
            returnRes.subscribed = false;
            returnRes.countUpdated = false;
            returnRes.success = false;

            console.log("Already subscribed to channel", channelId);
            return returnRes;
        }

        returnRes.success = true;

        return returnRes;
    },

    unsubscribe: async (channelId) => {
        let returnRes = {
            success: false,
            unsubscribed: false,
            countUpdated: false
        }

        if(!isValid(channelId)) {
            console.log("Invalid channelId", channelId);
            return { success: false, unsubscribed: false };
        }

        // check if already subscribed
        const subscriptions = await EncryptedStorage.getItem("subscriptions");
        const subscriptionsCount = await EncryptedStorage.getItem("subscriptions_count");

        if (subscriptions === null) {
            console.log("Failed while getting subscriptions", subscriptions);
            return { success: false, unsubscribed: false };
        }

        let subscriptionStatus = subscriptions.includes(channelId);

        if(subscriptionStatus === true){
            // remove from subscriptions
            let subscriptionsArr = JSON.parse(subscriptions);
            let filteredSubscriptions = subscriptionsArr.filter(item => item !== channelId);
            await EncryptedStorage.setItem('subscriptions', JSON.stringify(filteredSubscriptions));

            // update subscriptions count
            let subscriptionsCountInt = parseInt(subscriptionsCount);
            await EncryptedStorage.setItem('subscriptions_count', JSON.stringify(subscriptionsCountInt - 1));

            returnRes.unsubscribed = true;
            returnRes.countUpdated = true;
        } else if (subscriptionStatus === false) {
            returnRes.unsubscribed = false;
            returnRes.countUpdated = false;
            returnRes.success = false;

            console.log("Subscription not found ", channelId);
            return returnRes;
        }

        returnRes.success = true;

        return returnRes;
    },

    subscriptionStatus: async (channelId) => {
        if(!isValid(channelId)) {
            console.log("Invalid channelId", channelId);
            return { success: false, subscribed: false };
        }

        // check if already subscribed
        const subscriptions = await EncryptedStorage.getItem("subscriptions");

        if (subscriptions === null) {
            console.log("Failed while getting subscriptions", subscriptions);
            return { success: false, subscribed: false };
        }

        let subscriptionStatus = subscriptions.includes(channelId);

        if(subscriptionStatus === true){
            return { success: true, subscribed: true };
        } else if (subscriptionStatus === false) {
            return { success: true, subscribed: false };
        }
    },

    metadata: async (uploader_id) => {
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

    nextPage: async (uploader_id, nextpage) => {
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

    tabsData: async (data) => {
        let url = `${config.baseUrl}/channels/tabs?data=${data}`;

        try {
            let res = await axios.get(url);
            if (res.status === 200) {
                return { success: true, data: res.data }
            }
        } catch (error) {
            console.log("Failed while getting shorts");
            return { success: false, error: error }
        }
    },

    tabsNextPage: async (data, nextpage) => {
        let url = `${config.baseUrl}/channels/tabs?data=${data}&nextpage=${nextpage}`;

        try {
            let res = await axios.get(url);
            if (res.status === 200) {
                return { success: true, data: res.data }
            }
        } catch (error) {
            console.log("Failed while getting shorts");
            return { success: false, error: error }
        }
    }
};

