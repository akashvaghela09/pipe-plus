import { useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { pipePlus } from "../apis";
import { IconButton } from "react-native-paper";

export const SubscriptionScreen = () => {

    const [subscriptions, setSubscriptions] = useState([]);

    const fetchUserSubscriptions = async () => {
        let data = await pipePlus.user.subscriptions();
        console.log(data);
    }

    useEffect(() => {
        fetchUserSubscriptions();
    }, []);

    return (
        <View className="bg-[#0f0f0f]">
            {
                subscriptions.length === 0 &&
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
                subscriptions.length > 0 &&
                <View className="flex justify-center items-center h-screen">
                    <Text className="text-3xl font-bold">Subscription Screen</Text>
                </View>
            }
        </View>
    )
};

const styles = StyleSheet.create({

});