import { ScrollView, Text, View } from "react-native";
import  { useDispatch, useSelector } from "react-redux";
import { Button } from "react-native-paper";
import { setCount } from "../redux/app/appSlice";

export const LibraryScreen = () => {

    const dispatch = useDispatch();

    const { count } = useSelector(state => state.app);
    const Increment = () => {
        dispatch(setCount(count - 1));
    };

    return (
        <ScrollView className="h-screen">
            <View className="flex justify-center items-center h-screen">
                <Text className="text-3xl font-bold">Library Screen</Text>
                <Text className="text-4xl my-10">{count}</Text>
                <Button mode="contained" onPress={() => Increment()} className="bg-sky-600 text-slate-100" labelStyle={{fontSize: 20}}>
                    Increment
                </Button>
            </View>
        </ScrollView>
    )
};