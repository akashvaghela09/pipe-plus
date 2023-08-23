import { View } from "react-native";
import { useNavigation } from '@react-navigation/native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { Logo } from "..";

export const Header = () => {
    const navigation = useNavigation();

    return (
        <View className="flex flex-row p-2 items-center justify-between border-b-[1px] border-[#212121]">
            <Logo />
            <View className="flex flex-row gap-2 items-center px-2">
                <EvilIcons name="search" size={32} color="#fff" onPress={() => navigation.navigate('search')} />
                <EvilIcons name="user" size={32} color="#fff" />
            </View>
        </View>
    )
}