import { useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { pipePlus } from "../apis";
import { IconButton, useTheme } from "react-native-paper";
import { Button } from "../theme";
import { Header, VideoCard } from "../components";

export const SubscriptionScreen = () => {
    const { colors } = useTheme();
    const [subscriptionFeed, setSubscriptionFeed] = useState([]);

    const fetchFeed = async () => {
        console.log("Fetching subscription feed ...");

        let list = await pipePlus.user.subscriptions();
        let totalSubscriptions = list.data.length;

        if(totalSubscriptions === 0) {
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
    }

    useEffect(() => {
        fetchFeed();
    }, []);

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#0f0f0f' }}>
            {/* Header section with logo and icons */}
            <Header />
                {
                subscriptionFeed.length === 0 &&
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
                subscriptionFeed.length > 0 &&
                subscriptionFeed.map((video, index) => {
                    return (
                            <VideoCard key={video.id} video={video} />
                    )
                })
            }
        </ScrollView>
    )
};

const styles = StyleSheet.create({

});