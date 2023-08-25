import { useEffect, useState, useRef } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { ActivityIndicator, IconButton, TouchableRipple } from 'react-native-paper';
import { Button } from "../../theme/";
import { useSelector, useDispatch } from 'react-redux';
import { setIsFullScreen, setIsVisible, setStreamUrl, setSize, setIsPlaying, setSettingsOpen } from '../../redux/player/playerSlice';
import Video from 'react-native-video';
import { BackHandler } from 'react-native';
import Slider from '@react-native-community/slider';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatNumbers, formatReadableDate, formatTime, isValid } from '../../utils';
import { VideoCard } from '../';
import { useTheme } from 'react-native-paper';
import { pipePlus } from '../../apis';
import { setTabBarVisible } from '../../redux/app/appSlice';

export const Player = ({ navigator }) => {
    const dispatch = useDispatch();
    const { colors } = useTheme();
    const {
        isFullScreen,
        isVisible,
        streamUrl,
        hlsUrl,
        size,
        isPlaying,
        isLoading,
        relatedStreams,
        streamMetadata
    } = useSelector(state => state.player);

    const {
        title,
        views,
        uploaded,
        uploadedDate,
        uploaderName,
        uploaderSubscriberCount,
        uploaderUrl
    } = streamMetadata;

    const [played, setPlayed] = useState(0);
    const [buffered, setBuffered] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isSliderVisible, setSliderVisible] = useState(false);
    const lastTap = useRef(null);
    const videoRef = useRef(null);
    const [isRippleVisible, setRippleVisible] = useState(false);
    const [seekSide, setSeekSide] = useState(null);
    const [sliderTimer, setSliderTimer] = useState(null);
    const [subscribed, setSubscribed] = useState(false);
    const [channelId, setChannelId] = useState(null);

    const handlePlayback = (status) => {
        dispatch(setIsPlaying(status));
    }

    const resetData = () => {
        dispatch(setIsVisible(false));
        dispatch(setIsFullScreen(false));
        dispatch(setStreamUrl(""));

        handlePlayback(false);
        setBuffered(0);
        setPlayed(0);
    }

    const handlePlayerClick = () => {
        if (size === "small") {
            dispatch(setSize("normal"));
        }
    }

    const handleProgress = (progress) => {
        const { currentTime, seekableDuration, playableDuration } = progress;
        const PlayedPercentage = parseFloat(((currentTime / seekableDuration) * 100).toFixed(2));
        const BufferedPercentage = parseFloat(((playableDuration / seekableDuration) * 100).toFixed(2));

        setPlayed(PlayedPercentage);
        setBuffered(BufferedPercentage);
        setCurrentTime(currentTime);
    }

    const handleSeek = (value) => {
        videoRef.current.seek(value);
    };

    const handlePlayerReady = (e) => {
        // setIsPaused(false);
        setDuration(e.duration);
    }

    const startSliderTimer = () => {
        if (sliderTimer) {
            clearTimeout(sliderTimer); // clear the existing timer
        }

        const timer = setTimeout(() => {
            setSliderVisible(false);
        }, 5000); // hide after 5 seconds

        setSliderTimer(timer);
    };

    const handleTap = () => {
        if (isSliderVisible === false) {
            setSliderVisible(true);
            if (size === "small") {
                dispatch(setSize("normal"));
            }
        } else {
            startSliderTimer(); // reset the timer if the user taps while the slider is already visible
        }
    };

    const handleDoubleTap = (side) => {
        const now = Date.now();

        if (lastTap.current && (now - lastTap.current) < 300) {
            setRippleVisible(true);
            setTimeout(() => setRippleVisible(false), 500); // hide ripple after 500ms

            if (side === 'left') {
                handleSeek(currentTime - 15);
                setSeekSide('left');
            } else {
                handleSeek(currentTime + 15);
                setSeekSide('right');
            }

            // Reset lastTap to null after detecting double tap
            lastTap.current = null;
            startSliderTimer(); // reset the timer if the user double taps
        } else {
            lastTap.current = now;
        }
    };

    const handleSettingsOpen = () => {
        dispatch(setSettingsOpen(true));
    }

    const handleSubscribe = async () => {
        let data = await pipePlus.channel.subscribe(channelId);
        if (data.success === true) {
            setSubscribed(true);
        }
    }

    const handleUnsubscribe = async () => {
        let data = await pipePlus.channel.unsubscribe(channelId);
        if (data.success === true) {
            setSubscribed(false);
        }
    }

    const checkSubscription = async () => {
        const id = uploaderUrl?.split("/channel/")[1];
        setChannelId(id);

        let status = await pipePlus.channel.subscriptionStatus(id);
        if (status.subscribed === true) {
            setSubscribed(true);
        } else {
            setSubscribed(false);
        }
    }

    const handleFullScreen = () => {
        if(isFullScreen === false) {
            dispatch(setTabBarVisible(false));
            dispatch(setIsFullScreen(true));
        } else {
            dispatch(setTabBarVisible(true));
            dispatch(setIsFullScreen(false));
        }
    }

    useEffect(() => {
        const backAction = () => {
            if (size === "normal") {
                dispatch(setSize("small"));
                console.log("minimize app");
                return true;
            } else if (size === "small" && isVisible === true) {
                console.log("close modal");
                resetData();
                return true;
            } else if (isVisible === false) {
                console.log("exit app");
            }
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, [size, isVisible]);

    useEffect(() => {
        if (isSliderVisible === true) {
            startSliderTimer();
        }

        return () => {
            if (sliderTimer) {
                clearTimeout(sliderTimer); // clear the timer if the component is unmounted or if the effect runs again
            }
        };
    }, [isSliderVisible]);

    useEffect(() => {
            checkSubscription();
    }, [subscribed, streamMetadata.uploaderUrl]);

    return (
        isVisible &&
        <TouchableOpacity activeOpacity={size === "small" ? 0.7 : 1} onPress={() => handlePlayerClick()}>
            <View className={`bg-[#0f0f0f] flex justify-center items-center ${size === "normal" && "h-screen w-full"}`}>
                <ScrollView stickyHeaderIndices={[0]} style={{ width: "100%" }} className="flex flex-col">
                    {
                        isLoading ?
                            <View className="flex justify-center items-center bg-[#212121]" style={{ borderWidth: 1, width: size === "normal" ? "100%" : 100, aspectRatio: 16 / 9 }}>
                                <ActivityIndicator size={size === "normal" ? "large" : "small"} animating={true} color="red" />
                            </View>
                            :
                            <TouchableOpacity
                                activeOpacity={1} // maintain full opacity
                                onPress={handleTap}
                            >
                                <View style={styles.videoWrapper}>
                                    <Video
                                        // source={{ uri: hlsUrl }}
                                        source={{ uri: streamUrl }}
                                        ref={videoRef}
                                        style={size === "small" ? styles.videoSmall : styles.videoNormal}
                                        currentPlaybackTime={10}
                                        resizeMode="contain"
                                        playInBackground={true}     // Continue playing when app goes into background
                                        playWhenInactive={true}    // Continue playing on interactions like notifications
                                        pictureInPicture={true}    // Enables PiP on supported platforms
                                        onProgress={(e) => handleProgress(e)}
                                        paused={isPlaying}
                                        onLoad={(e) => handlePlayerReady(e)}
                                    />

                                    {
                                        size === "normal" && isSliderVisible &&
                                        <>
                                            {/* Controls Wrapper */}
                                            <View className="absolute top-0 left-0 h-full w-full" style={styles.controlWrapper}>

                                                {/* Backward seek */}
                                                <TouchableRipple rippleColor={isRippleVisible ? "rgba(0, 0, 0, .32)" : "rgba(0, 0, 0, 0)"} onPress={() => handleDoubleTap('left')} className="w-1/2 h-full flex justify-center items-center">
                                                    {
                                                        (isRippleVisible && seekSide === "left") ?
                                                            <MaterialCommunityIcon name="rewind-15" size={30} color={colors.slate100} />
                                                            :
                                                            <View />
                                                    }
                                                </TouchableRipple>

                                                {/* Play/Pause button */}
                                                {
                                                    isPlaying === true ?
                                                        <IconButton
                                                            icon={() => <MaterialCommunityIcon name="play" size={70} color={colors.slate100} />}
                                                            size={70}
                                                            onPress={() => handlePlayback(false)}
                                                            style={{ ...styles.controlIcon, color: colors.slate100 }}
                                                        />
                                                        :
                                                        <IconButton
                                                            icon={() => <MaterialCommunityIcon name="pause" size={70} color={colors.slate100} />}
                                                            size={70}
                                                            onPress={() => handlePlayback(true)}
                                                            style={{ ...styles.controlIcon, color: colors.slate100 }}
                                                        />
                                                }

                                                {/* Forward seek */}
                                                <TouchableRipple rippleColor={isRippleVisible ? "rgba(0, 0, 0, .32)" : "rgba(0, 0, 0, 0)"} onPress={() => handleDoubleTap('right')} className="w-1/2 h-full flex justify-center items-center">
                                                    {
                                                        (isRippleVisible && seekSide === "right") ?
                                                            <MaterialCommunityIcon name="fast-forward-15" size={30} color={colors.slate100} />
                                                            :
                                                            <View />
                                                    }
                                                </TouchableRipple>

                                                {/* Fullscreen button */}
                                                <IconButton
                                                    icon={() => <MaterialCommunityIcon name={isFullScreen ? 'fullscreen-exit' : 'fullscreen'} size={30} color={colors.slate100} />}
                                                    size={30}
                                                    style={{ position: 'absolute', bottom: 5, right: 5 }}
                                                    onPress={() => handleFullScreen()}
                                                />

                                                {/* Close button */}
                                                <IconButton
                                                    icon={() => <MaterialCommunityIcon name="close" size={25} color={colors.slate100} />}
                                                    size={25}
                                                    style={{ position: 'absolute', top: 0, left: 5, zIndex: 100 }}
                                                    onPress={() => setSliderVisible(false)}
                                                />

                                                {/* Settings button */}
                                                <IconButton
                                                    icon={() => <MaterialCommunityIcon name="cog-outline" size={25} color={colors.slate100} />}
                                                    size={25}
                                                    style={{ position: 'absolute', top: 0, right: 5 }}
                                                    onPress={() => handleSettingsOpen()}
                                                />

                                                {/* Progress bar code */}
                                                <View style={styles.progressWrapper}>
                                                    <View style={{ ...styles.buffered, width: `${buffered}%` }} />
                                                    <View style={{ ...styles.played, width: `${played}%` }} />
                                                </View>
                                                <Slider
                                                    value={currentTime}
                                                    maximumValue={duration}
                                                    onValueChange={(e) => handleSeek(e)}
                                                    minimumTrackTintColor="red"
                                                    thumbTintColor="red"
                                                    maximumTrackTintColor="gray"
                                                    step={0.001}
                                                    style={{ ...styles.slider }}
                                                />
                                            </View>
                                            <View style={{ flexDirection: "row", width: "fit-content", position: 'absolute', bottom: 25, left: 20 }}>
                                                <Text style={{ fontSize: 12 }}>{formatTime(currentTime)}</Text>
                                                <Text style={{ opacity: 0.7, fontSize: 12 }}>  / {formatTime(duration)}</Text>
                                            </View>
                                        </>
                                    }
                                </View>
                            </TouchableOpacity>
                    }

                    {/* Video Metadata */}
                    {
                        size === "normal" &&
                        isFullScreen === false &&
                        title.length > 0 &&
                        <View className="p-3 mb-4">
                            <Text numberOfLines={2} style={{ fontSize: 16, fontWeight: 900, color: "white" }}>{title || ""}</Text>
                            <Text className="my-2 text-xs">{formatNumbers(views)}    {formatReadableDate(uploaded)}</Text>
                            <View className="flex flex-row items-center justify-between">
                                <View className="flex flex-row">
                                    <Image source={{ uri: streamMetadata.uploaderAvatar }} className="w-8 h-8 rounded-full" />
                                    <View className="flex flex-row items-center mx-3">
                                        <Text className="" style={{ fontSize: 16, fontWeight: 700, color: "white" }} numberOfLines={1}>{uploaderName || ""}</Text>
                                        <Text className="mx-2">{formatNumbers(uploaderSubscriberCount)}</Text>
                                    </View>
                                </View>

                                <Button
                                    title={subscribed ? "Unsubscribe" : "Subscribe"}
                                    onPress={() => subscribed ? handleUnsubscribe() : handleSubscribe()}
                                    labelStyle={{ color: subscribed ? "white" : "black" }}
                                    style={{ backgroundColor: subscribed ? colors.primary : "white" }}
                                />
                            </View>
                        </View>
                    }

                    {/* Related streams */}
                    {
                        size === "normal" &&
                        isFullScreen === false &&
                        relatedStreams.length > 0 &&
                        relatedStreams.map((stream, index) => {
                            return (
                                <VideoCard key={index} video={stream} />
                            )
                        })
                    }
                </ScrollView>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f0f0f'
    },
    videoNormal: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#000',
    },
    videoSmall: {
        width: 100,
        aspectRatio: 16 / 9,
    },
    videoPip: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    videoWrapper: {
        width: '100%',
        position: 'relative',
    },
    controlWrapper: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    controlIcon: {
        position: 'absolute',
        top: '46%',
        left: '46%',
        transform: [
            { translateX: -0.45 * 70 },  // 450% of the icon's width (given size={70})
            { translateY: -0.45 * 70 }   // 45% of the icon's height (given size={70})
        ],
        zIndex: 100,
    },
    progressWrapper: {
        height: 3,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 15
    },
    buffered: {
        height: 3,
        backgroundColor: 'gray',
        zIndex: 5,
    },
    played: {
        position: 'absolute',
        height: 3,
        bottom: 12,
        left: 15,
        backgroundColor: 'red',
        zIndex: 10,
    },
    slider: {
        position: 'absolute',
        bottom: 3,
        left: 0,
        width: '100%',
        height: 20,
        zIndex: 50,
    },
});