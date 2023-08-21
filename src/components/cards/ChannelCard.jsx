import { Image, View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { formatNumbers } from "../../utils";

export const ChannelCard = ({ channel }) => {
    const { name, thumbnail, description, subscribers, verified } = channel;

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
                <Text style={styles.text} numberOfLines={2}>{description}</Text>
                <Text style={styles.text}>{formatNumbers(subscribers)} subscribers</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    thumbnailContainer: {
        margin: 20,
        marginLeft: 40,
        marginRight: 40,
        borderWidth: 1,
        borderColor: "#212121",
        borderRadius: 99999,
    },
    thumbnail: {
        width: 80,
        height: 80,
        borderRadius: 50,
    },
    metadata: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",        
        gap: 3,
        marginRight: 20,
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
