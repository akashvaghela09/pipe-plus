import { useState } from 'react';
import { View, Text } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { screenOptions } from './AppNavigator'; // Assuming both files are in the same directory
import { Player } from '../components/ui/player/Player';
import { PlayerSettings } from '../components/ui/bottomSheet/PlayerSettings';
import { useSelector } from 'react-redux';

export const TabBar = ({ state, descriptors, navigation }) => {

    const stackIndex = state.routes[state.index].state?.index;
    const stackRoute = state.routes[state.index]?.state?.routes[stackIndex];
    const stackRouteName = stackRoute?.name;

    const { settingsOpen } = useSelector(state => state.player);

    return (
        <>
            <Player />
            {
                settingsOpen && <PlayerSettings />
            }
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#0f0f0f', width: "auto", borderTopColor: "#212121", borderTopWidth: 1 }}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    const isFocused = state.index === index;

                    const IconComponent = screenOptions(route, isFocused ? 'white' : '#14532d');

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    if (stackRouteName === "search") {
                        return null;
                    }

                    return (
                        <TouchableRipple
                            key={index}
                            borderless={true}
                            onPress={onPress}
                            rippleColor="rgba(54, 54, 54, .52)" // adjust this as needed
                            style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}
                        >
                            <View style={{ alignItems: 'center' }}>
                                {IconComponent}
                                <Text style={{ color: isFocused ? 'white' : '#f1f5f9', fontSize: 10 }}>
                                    {label}
                                </Text>
                            </View>
                        </TouchableRipple>
                    );
                })}
            </View>
        </>
    );
}
