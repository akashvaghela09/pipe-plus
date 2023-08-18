import { View, Text, ScrollView } from 'react-native';

const App = () => {
    return (
        <ScrollView className="bg-[#0f0f0f]">
            <View className="h-screen flex justify-center items-center">
                <Text className="text-4xl text-blue-500">HELLO REACT NATIVE!</Text>
            </View>
        </ScrollView>
    );
}

export default App;