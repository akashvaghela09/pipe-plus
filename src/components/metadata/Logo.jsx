import React from 'react'
import { View, Text } from 'react-native'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { useTheme } from "react-native-paper"

export const Logo = () => {
    const { colors } = useTheme()
    return (
        <View className="flex flex-row items-center w-fit px-2">
            <Fontisto
                name="youtube-play"
                size={21}
                color={colors.blue500}
                style={{
                    position: "absolute",
                    left: 7,
                    top: 4,
                    zIndex: 99999,
                    transform: [
                        { rotate: '180deg' }
                    ],
                    transformOrigin: 'left bottom',
                }} />
            <View className="bg-slate-100 w-4 h-4 mx-1" />
            <Text className="text-xl font-bold text-slate-100 text-opacity-50 mx-2" >Ozon</Text>
        </View>
    )
}