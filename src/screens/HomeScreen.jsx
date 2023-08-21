import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { VideoCard } from "../components/cards/VideoCard";
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { Logo } from "../components/metadata/Logo";
import { useNavigation } from '@react-navigation/native';
import { pipePlus } from "../apis";

export const HomeScreen = () => {
    const navigation = useNavigation();
    const [feedData, setFeedData] = useState([]);

    const fetchDummyFeed = async () => {
        console.log("Fetching dummy feed data");

        let res = await pipePlus.feed.dummy();

        if(res.success === false) {
            return;
        }

        setFeedData(res.data);
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