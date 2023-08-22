import { useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { pipePlus } from "../apis";
import { IconButton } from "react-native-paper";

export const LibraryScreen = () => {


    return (
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
    )
};

const styles = StyleSheet.create({

});