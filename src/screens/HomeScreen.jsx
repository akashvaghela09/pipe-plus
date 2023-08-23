import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Header, VideoCard } from "../components/";
import { useNavigation } from '@react-navigation/native';
import { pipePlus } from "../apis";
import { shuffleArray } from "../utils";

export const HomeScreen = () => {
    const navigation = useNavigation();
    const [feedData, setFeedData] = useState([]);

    const fetchDummyFeed = async () => {
        console.log("Fetching dummy feed data");

        let res = await pipePlus.feed.dummy();

        if (res.success === false) {
            return;
        }

        setFeedData(res.data);
    };

    const fetchFeed = async () => {
        console.log("Fetching feed data");

        let list = await pipePlus.user.subscriptions();
        let totalSubscriptions = list.data.length;

        if(totalSubscriptions === 0) {
            let res = await pipePlus.feed.dummy();
    
            if (res.success === false) {
                return;
            }
    
            setFeedData(res.data);
            return;
        }

        let res = await pipePlus.feed.suggestionBased(list.data);
        
        if (res.success === false) {
            return;
        }

        let feed = [...shuffleArray(res.data)];
        setFeedData(feed);
    }

    useEffect(() => {
        fetchFeed();
    }, []);

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#0f0f0f' }}>
            {/* Header section with logo and icons */}
            <Header />

            {/* Feed section */}
            {feedData.length > 0 && feedData.map((stream) => {
                return (
                    <VideoCard key={stream.id} video={stream} />
                )
            })}
        </ScrollView>
    )
};