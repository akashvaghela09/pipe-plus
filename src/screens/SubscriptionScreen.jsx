import { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, RefreshControl } from "react-native";
import { pipePlus } from "../apis";
import { IconButton, useTheme } from "react-native-paper";
import { Header, VideoCard } from "../components";

export const SubscriptionScreen = () => {
    const { colors } = useTheme();
    const [subscriptionFeed, setSubscriptionFeed] = useState([]);
    const [visibleFeed, setVisibleFeed] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchFeed = async () => {
        setRefreshing(true)
        console.log("Fetching subscription feed ...");

        let list = await pipePlus.user.subscriptions();
        let totalSubscriptions = list.data.length;

        if (totalSubscriptions === 0) {
            let res = await pipePlus.feed.dummy();

            if (res.success === false) {
                return;
            }

            setSubscriptionFeed(res.data);
            return;
        }

        let res = await pipePlus.feed.subscriptionBased(list.data);

        if (res.success === false) {
            return;
        }

        let feed = [...res.data];

        setSubscriptionFeed(feed);
        setRefreshing(false);
    }

    const loadMoreItems = () => {
        const nextItems = subscriptionFeed.slice(visibleFeed.length, visibleFeed.length + 20); // Load next 20 items
        setVisibleFeed([...visibleFeed, ...nextItems]);
    };

    const handleRefresh = () => {
        fetchFeed();
    }

    useEffect(() => {
        fetchFeed();
    }, []);

    useEffect(() => {
        setVisibleFeed(subscriptionFeed.slice(0, 10));
    }, [subscriptionFeed]);

    return (
        <View style={{ flex: 1, backgroundColor: '#0f0f0f' }}>
            {/* Header section with logo and icons */}
            <Header />
            {
                visibleFeed.length === 0 &&
                <View className="flex justify-center items-center h-screen">
                    <IconButton
                        icon="alert-circle-outline"
                        color="#212121"
                        size={80}
                    />
                    <Text className="text-2xl font-bold text-slate-100 text-opacity-50">No subscriptions found 😢</Text>
                </View>
            }

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
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                        />
                    }
                />
            }
        </View>
    )
};

const styles = StyleSheet.create({

});