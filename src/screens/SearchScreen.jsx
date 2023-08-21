import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { IconButton } from "react-native-paper";
import { v4 as uuid } from 'uuid';
import { config } from "../configs/config";
import { useDispatch } from "react-redux";
import { setTabBarVisible } from "../redux/app/appSlice";
import { VideoCard } from "../components/cards/VideoCard";
import { ChannelCard } from "../components/cards/ChannelCard";

export const SearchScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [nextPage, setNextPage] = useState(null);
    const [query, setQuery] = useState("");
    const [suggestionList, setSuggestionList] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [autoFocus, setAutoFocus] = useState(true);
    const [showSearchSuggestions, setShowSearchSuggestions] = useState(true);
    const debounceTimeoutRef = useRef(null);

    const handleSearchQuery = async () => {
        if (query.length === 0) {
            return;
        }

        let res = await axios.get(`${config.baseUrl}/suggestions?query=${query}`);
        data = [...res?.data];

        setSuggestionList(data);
    }

    const handleSearchClear = () => {
        setQuery("");
        setAutoFocus(true);
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

    const handleSearchStream = async () => {
        handleTabBar(true);

        if(query.length === 0) {
            return;
        }

        setShowSearchSuggestions(false);

        let res = await axios.get(`${config.baseUrl}/search?q=${query}&filter=all`);

        if(res?.data?.items.length > 0) {
            setNextPage(res?.data?.nextpage);
            // setSearchResults(res?.data?.items);
        }

        let list = [];

        res?.data?.items.forEach((item) => {
            if(item.type === "channel" || item.type === "stream"){
                list.push(item)
            }
        })

        setSearchResults([...list]);
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
            }, 500); // 500ms debounce time
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

            {
                showSearchSuggestions === false && 
                searchResults.length > 0 &&
                searchResults.map((result) => {
                    if(result.type === "channel") {
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
});