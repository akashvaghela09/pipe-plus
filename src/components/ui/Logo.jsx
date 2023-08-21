import React from 'react'
import { View, Text } from 'react-native'

export const Logo = () => {
    return (
        <View className="flex flex-row w-fit px-2">
            <Text className="text-2xl font-bold text-red-600">Pipe</Text>
            <Text className="text-2xl font-bold text-slate-100">Plus</Text>
        </View>
    )
}