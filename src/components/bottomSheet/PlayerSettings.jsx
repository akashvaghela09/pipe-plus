import React, { useCallback, useRef, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Dimensions } from "react-native";
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSelector, useDispatch } from 'react-redux';
import { setBottomSheetVisible, setStreamUrl } from '../../redux/player/playerSlice';
import { Button, useTheme } from 'react-native-paper';

export const PlayerSettings = () => {
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const bottomSheetRef = useRef(null);
    const deviceWidth = Dimensions.get('window').width;
    const deviceHeight = Dimensions.get('window').height;
    const [settingsOptions, setSettingsOptions] = useState("quality");
    const { isFullScreen } = useSelector((state) => state.player);

     const handleBottomSheetVisibility = (value) => {
        dispatch(setBottomSheetVisible(value));
    }

    // callbacks
    const handleSheetChanges = useCallback((index) => {
        if (index === 0) {
            handleBottomSheetVisibility(false);
        }
    }, []);

    useEffect(() => {
        if (isFullScreen) {
            bottomSheetRef.current?.expand();  // expand to 100%
        } else {
            bottomSheetRef.current?.collapse();  // collapse to 50% or the first snap point
        }
    }, [isFullScreen]);

    return (
        <View style={{ ...styles.container, width: deviceWidth, height: deviceHeight }}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <BottomSheet
                    ref={bottomSheetRef}
                    index={1}
                    snapPoints={["5%", isFullScreen ? "100%" : "50%"]}
                    onChange={handleSheetChanges}
                    handleStyle={{ backgroundColor: colors.dark01, borderTopLeftRadius: 15, borderTopRightRadius: 15 }}
                >
                    <View style={{...styles.contentContainer, backgroundColor: colors.dark01}}>
                        {
                            settingsOptions === "quality" &&
                            <View>
                                <Text>Quality</Text>
                            </View>
                        }
                    </View>
                </BottomSheet>
            </GestureHandlerRootView>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        zIndex: 500, 
        position: "absolute", 
        top: 0, 
        left: 0, 
        backgroundColor: "#00000080",
        paddingLeft: 7,
        paddingRight: 7,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    }
});