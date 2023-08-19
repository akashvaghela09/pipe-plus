import { ScrollView, Text, View } from "react-native";

export const HomeScreen = () => {
    return (
        <ScrollView className="h-screen">
            <View className="flex justify-center items-center h-screen">
                <Text className="text-3xl font-bold">Home Screen</Text>
            </View>
        </ScrollView>
    )
};