import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { IconButton } from "react-native-paper";
import { v4 as uuid } from 'uuid';
import { config } from "../configs/config";

export const SearchScreen = ({ navigation }) => {
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchAutoFocus, setSearchAutoFocus] = useState(true);
    const debounceTimeoutRef = useRef(null);

    const handleSearchQuery = async () => {
        if (searchText.length === 0) {
            return;
        }

        let res = await axios.get(`${config.baseUrl}/suggestions?query=${searchText}`);
        data = [...res?.data];

        setSearchResults(data);
    }

    const HandleSearchClear = () => {
        setSearchText("");
        setSearchAutoFocus(true);
    }

    const handleFillSearchBar = (text) => {
        setSearchText(text);
    }

    const handleGoBack = () => {
        navigation.goBack();
    }

    const handleSearchStream = () => {
        navigation.navigate('result', {
            query: searchText,
        });
    }

    useEffect(() => {
        if (searchText.length > 3) {
            // Clear any existing timeout
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }

            // Set a new timeout
            debounceTimeoutRef.current = setTimeout(() => {
                handleSearchQuery();
            }, 500); // 500ms debounce time
        } else {
            setSearchResults([]);
        }
    }, [searchText]);

    return (
        <ScrollView style={styles.wrapper}>
            <View className="flex flex-row items-center">
                <IconButton
                    icon="arrow-left"
                    color="#fff"
                    size={25}
                    onPress={() => handleGoBack()}
                />
                <TextInput
                    style={styles.input}
                    onSubmitEditing={handleSearchStream}
                    onChangeText={setSearchText}
                    value={searchText}
                    autoFocus={searchAutoFocus}
                    returnKeyType="search"
                    placeholder="Search Youtube"
                />
                {
                    searchText.length > 0 &&
                    <IconButton
                        icon="close"
                        color="#fff"
                        size={22}
                        onPress={() => HandleSearchClear()}
                        style={{ position: "absolute", right: 45, top: 2 }}
                    />
                }
                <IconButton
                    icon="magnify"
                    color="#fff"
                    size={22}
                    onPress={handleSearchStream}
                    mode="contained"
                />
            </View>
            {
                searchResults.length > 0 &&
                searchResults.map((result) => {
                    return (
                        <View key={uuid()} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity activeOpacity={0.8} style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                                <IconButton
                                    icon="history"
                                    color="#fff"
                                    size={25}
                                    onPress={() => console.log('Pressed')}
                                    style={{ padding: 0, marginTop: 0, marginBottom: 0 }}
                                />
                                <Text
                                    numberOfLines={1}
                                    style={{ flex: 1 }}
                                >
                                    {result}
                                </Text>
                            </TouchableOpacity>
                            <IconButton
                                icon="arrow-top-left"
                                color="#fff"
                                size={25}
                                onPress={() => handleFillSearchBar(result)}
                                style={{ padding: 0, marginTop: 0, marginBottom: 0 }}
                            />
                        </View>
                    )
                })
            }
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: "#0f0f0f",
        width: "100%",
    },
    input: {
        backgroundColor: "#272727",
        margin: 3,
        padding: 15,
        paddingBottom: 5,
        paddingTop: 5,
        flex: 1,
        borderRadius: 9999,
    },
});