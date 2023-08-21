import { ScrollView, Text, View } from "react-native";

export const ResultScreen = ({ route }) => {

    const { query } = route.params;

    return (
        <ScrollView className="h-screen">
            <View className="flex justify-center items-center h-screen">
                <Text className="text-3xl font-bold">Result Screen</Text>
                <Text className="text-3xl font-bold">{query}</Text>
            </View>
        </ScrollView>
    )
};