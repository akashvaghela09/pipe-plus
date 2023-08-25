import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { formatNumbers, formatReadableDate, formatTime, isValid } from '../../utils';
import { useDispatch } from 'react-redux';
import FastImage from 'react-native-fast-image';
import {
    setAvailableQualities,
    setHlsUrl,
    setIsVisible,
    setLoading,
    setRelatedStreams,
    setSize,
    setStreamMetadata,
    setStreamUrl
} from '../../redux/player/playerSlice';
import { pipePlus } from '../../apis';

export const VideoCard = ({ video }) => {
    const dispatch = useDispatch();

    const handleStreamPlay = async () => {

        let initMetaData = {
            streamId: "",
            isShort: false,
            shortDescription: "",
            thumbnail: "",
            title: "",
            type: "",
            uploaded: 0,
            uploadedDate: "",
            uploaderAvatar: "",
            uploaderName: "",
            uploaderUrl: "",
            uploaderVerified: false,
            views: 0,
            uploaderSubscriberCount: 0
        }

        dispatch(setStreamMetadata(initMetaData));
        dispatch(setLoading(true));
        dispatch(setStreamUrl(""));
        dispatch(setSize("normal"));
        dispatch(setIsVisible(true));
        dispatch(setRelatedStreams([]));
        dispatch(setAvailableQualities([]));

        let stream = {
            streamId: video.url.split("=")[1],
            isShort: video.isShort,
            shortDescription: video.shortDescription,
            thumbnail: video.thumbnail,
            title: video.title,
            type: video.type,
            uploaded: video.uploaded,
            uploadedDate: video.uploadedDate,
            uploaderAvatar: video.uploaderAvatar,
            uploaderName: video.uploaderName,
            uploaderUrl: video.uploaderUrl,
            uploaderVerified: video.uploaderVerified,
            views: video.views,
        }

        let validQuality = [];
        let validUrl = "";
        let hlsUrl = "";

        let res = await pipePlus.stream.get(stream.streamId);

        if (!isValid(res)) {
            console.log("Stream data is invalid");
            return;
        }

        res.videoStreams.forEach((item) => {
            if (item.mimeType === "video/mp4" && item.videoOnly === false) {
                validQuality.push(item);
            }
        });

        validUrl = validQuality[0].url;
        hlsUrl = res.hls;
        stream.uploaderSubscriberCount = res.uploaderSubscriberCount;

        dispatch(setStreamMetadata(stream));
        dispatch(setStreamUrl(validUrl));
        dispatch(setHlsUrl(hlsUrl));
        dispatch(setAvailableQualities(validQuality));
        dispatch(setRelatedStreams(res.relatedStreams));
        dispatch(setLoading(false));
    }

    return (
        <TouchableOpacity activeOpacity={0.75} onPress={() => handleStreamPlay()}>
            <View className="mb-4">
                <View className="relative">
                    {/* <Image source={{ uri: video.thumbnail }} className="w-full aspect-video" /> */}
                    <FastImage
                        style={{ width: "100%", aspectRatio: 16 / 9 }}
                        source={{
                            uri: video.thumbnail,
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                    <Text className="absolute bottom-0 right-0 px-1 m-2 rounded-md bg-[#00000080] text-slate-100">{formatTime(video.duration)}</Text>
                </View>
                <View className="flex flex-row items-start py-1">
                    <View className="p-2 py-2">
                        <Image source={{ uri: video.uploaderAvatar }} className="w-10 h-10 rounded-full" />
                    </View>
                    <View className="flex flex-col py-1 mx-1" style={{ flex: 1, alignItems: "flex-start" }}>
                        <Text numberOfLines={1} className="text-slate-100 my-1" style={{ fontWeight: "500" }}>{video.title}</Text>
                        <Text className="text-slate-100 text-opacity-50 text-[11px]" style={{ opacity: 0.5 }}>{video.uploaderName} • {formatNumbers(video.views)} • {formatReadableDate(video.uploaded)}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
};