import React, { useCallback, useMemo, useRef } from 'react';
import { Text, View, StyleSheet } from "react-native";
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSelector, useDispatch } from 'react-redux';
import { setSettingsOpen } from '../../redux/player/playerSlice';
export const PlayerSettings = () => {
    const dispatch = useDispatch();
    const bottomSheetRef = useRef(null);

    // variables
    const snapPoints = useMemo(() => ['5%', '55%'], []);

    // callbacks
    const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index);

        if(index === 0){
            dispatch(setSettingsOpen(false))
        }
    }, []);

    return (
            <View style={styles.container} className="h-screen">
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <BottomSheet
                        ref={bottomSheetRef}
                        index={1}
                        snapPoints={snapPoints}
                        onChange={handleSheetChanges}
                    >
                        <View style={styles.contentContainer}>
                            <Text>Awesome 🎉</Text>
                        </View>
                    </BottomSheet>
                </GestureHandlerRootView>
            </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 7,
        paddingRight: 7,
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
});