import { Image, View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
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
                <Text style={styles.text}>{formatNumbers(subscribers)} subscribers</Text>
                <Button
                    onPress={() => console.log('Pressed')}
                    mode="contained"
                    labelStyle={{ color: "#212121" , fontSize: 12,  height: 20 }}
                    contentStyle={{ height: 33}}
                    style={{ width: 80, marginTop: 15 }}
                    buttonColor="white"
                    compact={true}
                >
                    Subscribe
                </Button>
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
