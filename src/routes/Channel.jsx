import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { pipePlus } from "../apis";
import { TiTick } from "react-icons/ti";
import { formatNumbers, formatTime } from "../utils";
import { Spinner } from "../components";

export const Channel = () => {
    const { channelId } = useParams();
    const [channel, setChannel] = useState(null);
    const [tab, setTab] = useState("videos");
    const [nextpage, setNextpage] = useState(null);
    const [videoStreamList, setVideoStreamList] = useState([]);
    const videoSectionRef = useRef(null);

    const fetchChannelData = async () => {
        let res = await pipePlus.channel.getChannel(channelId);

        if (res.success === false) {
            return;
        }

        setChannel(res.data);
        setVideoStreamList(res.data.relatedStreams);
        
        let data = JSON.parse(res.data.nextpage);
        data.url = data.url.split("&prettyPrint=false")[0];
        let stringifiedData = JSON.stringify(data);

        setNextpage(stringifiedData);
    }

    const handleTabChange = (tab) => {
        setTab(tab);
    }

    const loadMoreStreams = async () => {
        console.log("loading more streams");
        let res = await pipePlus.channel.getNextPage(channelId, nextpage);

        if (res.success === false) {
            return;
        } else if (res.data.relatedStreams.length === 0) {
            return;
        }

        let data = JSON.parse(res.data.nextpage);
        data.url = data.url.split("&prettyPrint=false")[0];
        let stringifiedData = JSON.stringify(data);

        setNextpage(stringifiedData);
        setVideoStreamList([...videoStreamList, ...res.data.relatedStreams]);
    }

    useEffect(() => {
        const handleScroll = async () => {
            if(channel === null || nextpage === null){
                return;
            }

            const videoSectionElement = videoSectionRef.current;
            let videoSectionHeight = videoSectionElement.clientHeight;
            let pageScroll = window.scrollY;
            let differece = videoSectionHeight - pageScroll;
            let allowedPercentage = 0.25 * videoSectionHeight;
            if (differece < allowedPercentage) {
                await loadMoreStreams();
            }
        };

        document.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('scroll', handleScroll);
        };
    }, [nextpage]);

    useEffect(() => {
        fetchChannelData();
    }, [channelId]);

    return (
        channel === null ?
            <div className="h-screen w-full flex justify-center items-center">
                <Spinner />
            </div>
            :
            <div className="flex flex-col justify-center items-center">
                <img src={channel.bannerUrl} alt="channel-poster" className="object-cover h-[100px]" />
                <img src={channel.avatarUrl} alt="channel-avatar" className="m-3 rounded-full" />
                <span className="flex items-center gap-2 text-slate-100 text-3xl font-extrabold">
                    <p>{channel.name}</p>
                    {
                        channel.verified &&
                        <TiTick className="text-xl bg-slate-100 text-black rounded-full" />
                    }
                </span>
                <p className="text-slate-100 text-opacity-50 text-sm">{formatNumbers(channel.subscriberCount)} subscribers</p>
                <p className="text-slate-100 text-opacity-50 line-clamp-2 m-2 text-sm text-center">{channel.description}</p>

                <div className="mt-2 w-full">
                    <div className="flex">
                        <p className={`cursor-pointer w-fit py-2 px-4 text-slate-100 active:bg-slate-100 active:bg-opacity-30 ${tab === "videos" && "border-b-4 border-slate-100 border-opacity-50"}`} onClick={() => handleTabChange("videos")}>Videos</p>
                        <p className={`cursor-pointer w-fit py-2 px-4 text-slate-100 active:bg-slate-100 active:bg-opacity-30 ${tab === "shorts" && "border-b-4 border-slate-100 border-opacity-50"}`} onClick={() => handleTabChange("shorts")}>Shorts</p>
                        <p className={`cursor-pointer w-fit py-2 px-4 text-slate-100 active:bg-slate-100 active:bg-opacity-30 ${tab === "livestreams" && "border-b-4 border-slate-100 border-opacity-50"}`} onClick={() => handleTabChange("livestreams")}>Livestreams</p>
                    </div>

                    <div className="pt-5">
                        {
                            tab === "videos" &&
                            <div ref={videoSectionRef} className="flex flex-col gap-4">
                                {
                                    videoStreamList.map((video, index) => {
                                        return <Link to={video.url} key={video.url}>
                                        <div className="flex w-full px-3">
                                            <div className="relative w-[45%]">
                                                <img className="rounded-xl w-full min-h-[88px]" alt="video-thumb" src={video.thumbnail} />
                                                <p className="absolute bottom-1 right-1 text-slate-100 text-bold text-sm p-1 rounded-lg bg-black bg-opacity-80">{formatTime(video.duration)}</p>
                                            </div>
                                            <div className="w-[55%] px-2">
                                                <p className="text-slate-100 text-sm line-clamp-2 break-all">{video.title}</p>
                                                <p className="text-slate-100 text-opacity-50 text-xs">{formatNumbers(video.views)} views • {video.uploadedDate}</p>
                                            </div>
                                        </div>
                                        </Link>
                                    })
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
    )
}