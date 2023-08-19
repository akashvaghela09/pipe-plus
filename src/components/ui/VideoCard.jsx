import { View, Text, Image } from 'react-native';
import { formatNumbers, formatReadableDate, formatTime } from '../../utils';

export const VideoCard = ({ video }) => {
    return (
        <View className="mb-4">
            <View className="relative">
                <Image source={{ uri: video.thumbnail }} className="w-full aspect-video" />
                <Text className="absolute bottom-0 right-0 px-1 m-1 rounded-md bg-black text-slate-100">{formatTime(video.duration)}</Text>
            </View>
            <View className="flex flex-row items-start">
                <View className="p-2 py-[6px]">
                    <Image source={{ uri: video.uploaderAvatar }} className="w-10 h-10 rounded-full" />
                </View>
                <View className="py-1 mx-1 w-full">
                    <Text className="text-slate-100 line-clamp-2 break-all">{video.title}</Text>
                    <Text className="text-slate-100 text-opacity-50 text-xs" style={{opacity: 0.5}}>{video.uploaderName} • {formatNumbers(video.views)} • {formatReadableDate(video.uploaded)}</Text>
                </View>
            </View>
        </View>
    )
};