import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // or any other icon library you prefer

export const Button = ({ title, iconName, onPress, style, labelStyle, iconSize = 24, iconColor }) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            style={[styles.button, { backgroundColor: colors.dark02 }, style]}
        >
            <View style={styles.content}>
                {iconName && <Icon name={iconName} size={iconSize} color={iconColor || colors.onPrimary} />}
                <Text style={[styles.text, { color: colors.onPrimary, fontSize: labelStyle?.fontSize || 12 }, labelStyle]}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 8,
        paddingLeft: 12,
        paddingRight: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 999999
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    text: {
        fontWeight: 600,
        lineHeight: 14,
    },
});

