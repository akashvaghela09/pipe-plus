import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { IconButton } from "react-native-paper";
import { v4 as uuid } from 'uuid';
import { config } from "../configs/config";
import { useDispatch } from "react-redux";
import { setTabBarVisible } from "../redux/app/appSlice";
import { VideoCard , ChannelCard } from "../components/";
import { pipePlus } from "../apis";

export const SearchScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [query, setQuery] = useState("");
    const [suggestionList, setSuggestionList] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [autoFocus, setAutoFocus] = useState(true);
    const [showSearchSuggestions, setShowSearchSuggestions] = useState(true);
    const debounceTimeoutRef = useRef(null);
    const searchInitiatedRef = useRef(false);

    const handleSearchQuery = async () => {
        if (query.length === 0 || searchInitiatedRef.current) {
            return;
        }

        let res = await axios.get(`${config.baseUrl}/suggestions?query=${query}`);
        data = [...res?.data];

        setSuggestionList(data);
        setSearchResults([]);
        setShowSearchSuggestions(true);

        searchInitiatedRef.current = false; // Reset the flag at the end
    }

    const handleSearchClear = () => {
        setAutoFocus(false);
        setQuery("");
        setShowSearchSuggestions(true);
        setSearchResults([]);
        setAutoFocus(true);

        searchInitiatedRef.current = false; // Reset the flag at the end
    }

    const handleFillSearchBar = (text) => {
        setQuery(text);
    }

    const handleGoBack = () => {
        navigation.goBack();
    }

    const handleTabBar = (value) => {
        dispatch(setTabBarVisible(value));
    }

    const handleSuggestionClick = async (result) => {
        handleFillSearchBar(result)
        handleSearchStream();
    }

    const handleSearchStream = async () => {
        setShowSearchSuggestions(false);
        handleTabBar(true);

        if (query.length === 0) {
            return;
        }

        // If a search is already initiated, dont show suggestions
        searchInitiatedRef.current = true; // Set the flag
        clearTimeout(debounceTimeoutRef.current); // Clear the timeout

        let res = await pipePlus.feed.search(query);

        if (res.success === false) {
            return;
        }

        setSearchResults([...res?.data?.items]);
    }

    useEffect(() => {
        if (query.length > 3) {
            // Clear any existing timeout
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }

            // Set a new timeout
            debounceTimeoutRef.current = setTimeout(() => {
                handleSearchQuery();
            }, 250); // 250ms debounce time
        } else {
            setSuggestionList([]);
        }
    }, [query]);

    useEffect(() => {
        handleTabBar(false);
        return () => {
            handleTabBar(true);
        }
    }, []);

    return (
        <ScrollView style={styles.wrapper} keyboardShouldPersistTaps="always">
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
                    onChangeText={setQuery}
                    onFocus={() => handleTabBar(false)}
                    value={query}
                    autoFocus={autoFocus}
                    returnKeyType="search"
                    placeholder="Search Youtube"
                />
                {
                    query.length > 0 &&
                    <IconButton
                        icon="close"
                        color="#fff"
                        size={22}
                        onPress={() => handleSearchClear()}
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
                showSearchSuggestions === true &&
                suggestionList.length > 0 &&
                suggestionList.map((result) => {
                    return (
                        <View key={uuid()} style={styles.centerItem}>
                            <TouchableOpacity onPress={() => handleSuggestionClick(result)} activeOpacity={0.8} style={styles.centerItem}>
                                <IconButton
                                    icon="history"
                                    color="#fff"
                                    size={25}
                                    onPress={() => console.log('Pressed')}
                                    style={styles.icon}
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
                                style={styles.icon}
                            />
                        </View>
                    )
                })
            }

            {
                showSearchSuggestions === false &&
                searchResults.length > 0 &&
                searchResults.map((result) => {
                    if (result.type === "channel") {
                        return (
                            <ChannelCard key={uuid()} channel={result} />
                        )
                    } else if (result.type === "stream") {
                        return (
                            <VideoCard key={uuid()} video={result} />
                        )
                    }
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
    icon: {
        padding: 0,
        marginTop: 0,
        marginBottom: 0
    },
    centerItem: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center"
    }
});