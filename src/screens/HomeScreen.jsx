import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import axios from "axios";
import { config } from "../configs/config";
import { VideoCard } from "../components/ui/VideoCard";
import { v4 as uuid } from 'uuid';

export const HomeScreen = () => {

    const [feedData, setFeedData] = useState([]);

    const fetchDummyFeed = async () => {
        console.log("Fetching dummy feed data");
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

            data = data.map((feed) => {
                return {
                    id: uuid(),
                    ...feed
                }
            });

            setFeedData([...data]);
        } catch (error) {
            console.log("Failed while fetching dummy feed data", error);
        }
    };

    useEffect(() => {
        fetchDummyFeed();
    }, []);

    return (
        <ScrollView className="h-screen bg-[#0f0f0f]">
            {
                feedData.length > 0 && feedData.map((stream) => {
                    return (
                        <VideoCard key={stream.id} video={stream} />
                    )
                })
            }
        </ScrollView>
    )
};