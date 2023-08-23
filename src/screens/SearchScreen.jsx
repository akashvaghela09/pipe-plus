import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { IconButton } from "react-native-paper";
import { v4 as uuid } from 'uuid';
import { config } from "../configs/config";
import { useDispatch } from "react-redux";
import { setTabBarVisible } from "../redux/app/appSlice";
import { VideoCard, ChannelCard } from "../components/";
import { pipePlus } from "../apis";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "react-native-paper";

export const SearchScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [query, setQuery] = useState("");
    const [suggestionList, setSuggestionList] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [autoFocus, setAutoFocus] = useState(true);
    const [showSearchSuggestions, setShowSearchSuggestions] = useState(true);
    const debounceTimeoutRef = useRef(null);
    const searchInitiatedRef = useRef(false);
    const { colors } = useTheme();
    
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
        <ScrollView style={{...styles.wrapper, backgroundColor: colors.background}} keyboardShouldPersistTaps="always">
            <View className="flex flex-row items-center">
                <IconButton
                    icon={() => <Icon name="arrow-left" size={25} color={colors.neutral300} />}
                    size={25}
                    onPress={() => handleGoBack()}
                />
                <TextInput
                    style={{...styles.input, backgroundColor: colors.neutral800}}
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
                        icon={() => <Icon name="close" size={25} color={colors.neutral300} />}
                        size={22}
                        onPress={() => handleSearchClear()}
                        style={{ position: "absolute", right: 45, top: 2 }}
                    />
                }
                <IconButton
                    icon={() => <Icon name="magnify" size={25} color={colors.neutral300} />}
                    size={22}
                    onPress={handleSearchStream}
                    mode="contained"
                    style={{ backgroundColor: colors.neutral800 }}
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
                                    icon={() => <Icon name="history" size={25} color={colors.neutral300} />}
                                    onPress={() => console.log('Pressed')}
                                    style={styles.icon}
                                />
                                <Text
                                    numberOfLines={1}
                                    style={{ flex: 1, fontWeight: 600, color: colors.neutral300 }}
                                >
                                    {result}
                                </Text>
                            </TouchableOpacity>
                            <IconButton
                                icon={() => <Icon name="arrow-top-left" size={25} color={colors.neutral300} />}
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
        width: "100%",
    },
    input: {
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