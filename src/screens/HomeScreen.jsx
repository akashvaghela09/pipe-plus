import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import axios from "axios";
import { config } from "../configs/config";
import { VideoCard } from "../components/cards/VideoCard";
import { v4 as uuid } from 'uuid';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { Logo } from "../components/metadata/Logo";
import { useNavigation } from '@react-navigation/native';

export const HomeScreen = () => {
    const navigation = useNavigation();
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
        <View style={{ flex: 1, backgroundColor: '#0f0f0f' }}>
            {/* Header section with logo and icons */}
            <View className="flex flex-row p-2 items-center justify-between border-b-[1px] border-slate-100">
                <Logo />
                <View className="flex flex-row gap-2 items-center px-2">
                    <EvilIcons name="search" size={32} color="#fff" onPress={() => navigation.navigate('search')} />
                    <EvilIcons name="user" size={32} color="#fff" />
                </View>
            </View>

            {/* Scrollable content */}
            <ScrollView>
                {feedData.length > 0 && feedData.map((stream) => {
                    return (
                        <VideoCard key={stream.id} video={stream} />
                    )
                })}
            </ScrollView>
        </View>
    )
};