import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { Header, VideoCard } from "../components/";
import { useNavigation } from '@react-navigation/native';
import { pipePlus } from "../apis";
import { shuffleArray } from "../utils";
import { IconButton } from "react-native-paper";

export const HomeScreen = () => {
    const navigation = useNavigation();
    const [feedData, setFeedData] = useState([]);
    const [visibleFeed, setVisibleFeed] = useState([]);

    const fetchFeed = async () => {
        console.log("Fetching feed data...");

        let list = await pipePlus.user.subscriptions();
        let totalSubscriptions = list.data.length;

        if (totalSubscriptions === 0) {
            let res = await pipePlus.feed.dummy();

            if (res.success === false) {
                return;
            }

            setFeedData(res.data);
            return;
        }

        let res = await pipePlus.feed.subscriptionBased(list.data);

        if (res.success === false) {
            return;
        }

        let feed = [...shuffleArray(res.data)];
        setFeedData(feed);
    }

    const loadMoreItems = () => {
        const nextItems = feedData.slice(visibleFeed.length, visibleFeed.length + 20); // Load next 20 items
        setVisibleFeed([...visibleFeed, ...nextItems]);
    };

    useEffect(() => {
        fetchFeed();
    }, []);

    useEffect(() => {
        setVisibleFeed(feedData.slice(0, 10));
    }, [feedData]);

    return (
        <View style={{ flex: 1, backgroundColor: '#0f0f0f' }}>
            {/* Header section with logo and icons */}
            <Header />

            {/* Feed section */}
            {
                visibleFeed.length > 0 &&
                <FlatList
                    data={visibleFeed}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({ item }) => (
                        <VideoCard key={item.id} video={item} />
                    )}
                    onEndReached={loadMoreItems}
                    onEndReachedThreshold={0.95} // Load more items when the end of the list is halfway visible
                />
            }

            {
                visibleFeed.length === 0 &&
                <View className="bg-[#0f0f0f]">
                    <View className="flex justify-center items-center h-screen">
                        <IconButton
                            icon="alert-circle-outline"
                            color="#212121"
                            size={80}
                        />
                        <Text className="text-2xl font-bold text-slate-100 text-opacity-50">No Channels/Feed found 😢</Text>
                    </View>
                </View>
            }
        </View>
    )
};