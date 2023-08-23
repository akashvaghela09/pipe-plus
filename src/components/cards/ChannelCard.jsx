import { useState, useEffect } from "react";
import { Image, View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { formatNumbers } from "../../utils";
import { Button } from "../../theme";
import { pipePlus } from "../../apis";
import { useTheme } from "react-native-paper";

export const ChannelCard = ({ channel }) => {
    const { colors } = useTheme();
    const { name, thumbnail, description, subscribers, verified } = channel;
    const [subscribed, setSubscribed] = useState(false);
    const channelId = channel?.url?.split("/channel/")[1];

    const handleSubscribe = async () => {
        let data = await pipePlus.channel.subscribe(channelId);

        if (data.success === true) {
            setSubscribed(true);
        }
    }

    const handleUnsubscribe = async () => {
        let data = await pipePlus.channel.unsubscribe(channelId);

        if (data.success === true) {
            setSubscribed(false);
        }
    }

    const checkSubscription = async () => {

        let status = await pipePlus.channel.subscriptionStatus(channelId);

        if (status.subscribed === true) {
            setSubscribed(true);
        }
    }

    useEffect(() => {
        checkSubscription();
    }, [subscribed]);

    return (
        <View style={styles.wrapper}>
            <View style={styles.thumbnailContainer}>
                <Image
                    style={styles.thumbnail}
                    source={{ uri: thumbnail }}
                />
            </View>
            <View style={styles.metadata}>
                <Text style={styles.title}>{name}</Text>
                <Text style={styles.text}>{formatNumbers(subscribers)} subscribers</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                    <Button
                        title={subscribed ? "Unsubscribe" : "Subscribe"}
                        onPress={() => subscribed ? handleUnsubscribe() : handleSubscribe()}
                        labelStyle={{ color: subscribed ? "white" : "black" }}
                        style={{ backgroundColor: subscribed ? colors.dark02 : "white" }}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "#212121",
    },
    thumbnailContainer: {
        flex: 1,
        margin: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    thumbnail: {
        width: 80,
        height: 80,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "#212121",
        borderRadius: 99999,
    },
    metadata: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        marginRight: 40,
    },
    title: {
        color: "#fff",
        fontWeight: 900,
        fontSize: 16,
    },
    text: {
        color: "#fff",
        fontSize: 12,
        opacity: 0.5,
    }
});
