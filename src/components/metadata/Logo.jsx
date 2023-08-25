import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
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
                style={styles.logoIcon} />
            <View className="bg-slate-100 w-5 h-4" />
            <Text style={{...styles.title, color: colors.neutral100}}>Ozon</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    logoIcon: {
        position: "absolute",
        left: 7,
        top: 6,
        zIndex: 99999,
        transform: [
            { rotate: '180deg' }
        ]
    },
    title: {
        fontFamily: 'LeagueGothic-Regular',
        fontSize: 25,
        margin: 0,
        marginLeft: 12
    }
})
