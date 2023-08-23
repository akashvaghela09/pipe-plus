import { useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { pipePlus } from "../apis";
import { IconButton } from "react-native-paper";
import { Header } from "../components";

export const LibraryScreen = () => {
    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#0f0f0f' }}>
            {/* Header section with logo and icons */}
            <Header />

            <View className="bg-[#0f0f0f]">
                <View className="flex justify-center items-center h-screen">
                    <IconButton
                        icon="alert-circle-outline"
                        color="#212121"
                        size={80}
                    />
                    <Text className="text-2xl font-bold text-slate-100 text-opacity-50">🚧   Comming soon   🚧</Text>
                </View>
            </View>
        </ScrollView>
    )
};

const styles = StyleSheet.create({

});