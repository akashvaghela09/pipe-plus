import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { pipePlus } from "../apis";
import { TiTick } from "react-icons/ti";
import { formatNumbers, formatTime, isValid, waitFor } from "../utils";
import { Spinner } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { setPageLoading } from "../redux/app/actions";
import { v4 as uuid } from 'uuid';

export const Channel = () => {
    const dispatch = useDispatch();
    const { channelId } = useParams();
    const [channel, setChannel] = useState(null);
    const [tab, setTab] = useState("videos");
    const [videoStreamList, setVideoStreamList] = useState([]);
    const [featuredChannels, setFeaturedChannels] = useState([]);
    const [nextpage, setNextpage] = useState(null);

    const videoSectionRef = useRef(null);

    const { pageLoading } = useSelector(state => state.app);

    const fetchChannelData = async () => {
        dispatch(setPageLoading(true));
        let res = null;

        if (tab === "videos") {
            res = await pipePlus.channel.metadata(channelId);
        } else {
            let desiredTab = channel.tabs.find(item => {
                return item.name === tab;
            });

            if (!isValid(desiredTab)) {
                dispatch(setPageLoading(false));
                return;
            }

            let newRes = await pipePlus.channel.tabsData(desiredTab.data);

            if (!newRes.success) {
                dispatch(setPageLoading(false));
                return;
            }

            res = {
                data: {
                    relatedStreams: newRes.data.content,
                    nextpage: newRes.data.nextpage
                },
                success: newRes.success
            }
        }

        if (!isValid(res?.success)) {
            dispatch(setPageLoading(false));
            return;
        }


        if (channel === null) {
            setChannel(res.data);
        }

        let list = res.data.relatedStreams.map(item => {
            item.id = uuid();
            return item;
        });

        if (tab === "channels") {
            setFeaturedChannels([...featuredChannels, ...list]);
        } else {
            setVideoStreamList([...videoStreamList, ...list]);
        }

        if (res?.data?.nextpage === null) {
            setNextpage(null);
            dispatch(setPageLoading(false));
            return;
        }

        let data = JSON.parse(res?.data?.nextpage);
        if (!isValid(data)) {
            dispatch(setPageLoading(false));
            return;
        }

        data.url = data.url.split("&prettyPrint=false")[0];
        let stringifiedData = JSON.stringify(data);

        setNextpage(stringifiedData);
        dispatch(setPageLoading(false));
    }

    const handleTabChange = (value) => {
        if (value === tab) {
            return;
        }

        resetData();
        setTab(value);
    }

    const loadMoreStreams = async () => {
        let res;

        if (tab === "videos") {
            res = await pipePlus.channel.nextPage(channelId, nextpage);
        } else {
            let desiredTab = channel.tabs.find(item => {
                return item.name === tab;
            });

            if (!isValid(desiredTab)) {
                dispatch(setPageLoading(false));
                return;
            }

            let newRes = await pipePlus.channel.tabsNextPage(desiredTab.data, nextpage);
            console.log(newRes);
            if (!newRes.success) {
                dispatch(setPageLoading(false));
                return;
            }

            res = {
                data: {
                    relatedStreams: newRes.data.content,
                    nextpage: newRes.data.nextpage
                },
                success: newRes.success
            }
        }

        if (!isValid(res?.success)) {
            return;
        } else if (res.data.relatedStreams.length === 0) {
            return;
        }

        console.log("assigning uuid ...");
        let list = res.data.relatedStreams.map(item => {
            item.id = uuid();
            return item;
        });

        if (tab === "channels") {
            setFeaturedChannels([...featuredChannels, ...list]);
        } else {
            setVideoStreamList([...videoStreamList, ...list]);
        }

        if (res?.data?.nextpage === null) {
            setNextpage(null);
            dispatch(setPageLoading(false));
            return;
        }

        let data = JSON.parse(res?.data?.nextpage);
        if (!isValid(data)) {
            dispatch(setPageLoading(false));
            return;
        }

        data.url = data.url.split("&prettyPrint=false")[0];
        let stringifiedData = JSON.stringify(data);

        setNextpage(stringifiedData);
    }

    const resetData = () => {
        setTab("videos");
        setNextpage(null);
        setVideoStreamList([]);
        setFeaturedChannels([]);
    }

    useEffect(() => {
        const handleScroll = async () => {
            const videoSectionElement = videoSectionRef?.current;

            if (channel === null || nextpage === null || videoSectionElement === null) {
                return;
            }

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
        setChannel(null);
        resetData();
        fetchChannelData();
    }, [channelId]);

    useEffect(() => {
        fetchChannelData();
    }, [tab]);

    return (
        (pageLoading === true || channel === null) ?
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
                <p className="text-slate-100 text-opacity-50 text-sm mt-2">{formatNumbers(channel.subscriberCount)} subscribers</p>
                <p className="text-slate-100 text-opacity-50 line-clamp-2 m-2 text-sm text-center">{channel.description}</p>

                <div className="mt-2 w-full">
                    <div className="flex">
                        <p className={`cursor-pointer w-fit py-2 px-3 text-slate-100 active:bg-slate-100 active:bg-opacity-30 ${tab === "videos" && "border-b-4 border-slate-100 border-opacity-50"}`} onClick={() => handleTabChange("videos")}>Videos</p>
                        <p className={`cursor-pointer w-fit py-2 px-3 text-slate-100 active:bg-slate-100 active:bg-opacity-30 ${tab === "shorts" && "border-b-4 border-slate-100 border-opacity-50"}`} onClick={() => handleTabChange("shorts")}>Shorts</p>
                        <p className={`cursor-pointer w-fit py-2 px-3 text-slate-100 active:bg-slate-100 active:bg-opacity-30 ${tab === "livestreams" && "border-b-4 border-slate-100 border-opacity-50"}`} onClick={() => handleTabChange("livestreams")}>Livestreams</p>
                        <p className={`cursor-pointer w-fit py-2 px-3 text-slate-100 active:bg-slate-100 active:bg-opacity-30 ${tab === "channels" && "border-b-4 border-slate-100 border-opacity-50"}`} onClick={() => handleTabChange("channels")}>Channels</p>
                    </div>

                    <div className="pt-5">
                        {
                            tab === "videos" &&
                            <div ref={videoSectionRef} className="flex flex-col gap-4">
                                {
                                    videoStreamList.map((video, index) => {
                                        return <Link to={video.url} key={video.id}>
                                            <div className="flex w-full px-3">
                                                <div className="relative w-[45%]">
                                                    <img className="rounded-xl w-full min-h-[88px]" alt="video-thumb" src={video.thumbnail} />
                                                    <p className="absolute bottom-1 right-1 text-slate-100 text-bold text-sm p-1 rounded-lg bg-black bg-opacity-80">{formatTime(video.duration)}</p>
                                                </div>
                                                <div className="w-[55%] px-2">
                                                    <p className="text-slate-100 text-sm line-clamp-2 max-w-[200px] break-words">{video.title}</p>
                                                    <p className="text-slate-100 text-opacity-50 text-xs">{formatNumbers(video.views)} views • {video.uploadedDate}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    })
                                }
                            </div>
                        }

                        {
                            tab === "shorts" &&
                            <div ref={videoSectionRef} className="flex flex-col gap-4">
                                {
                                    videoStreamList.map((video, index) => {
                                        return <Link to={video.url} key={video.id}>
                                            <div className="flex w-full px-3">
                                                <div className="relative w-[45%]">
                                                    <img className="rounded-xl w-full min-h-[88px]" alt="video-thumb" src={video.thumbnail} />
                                                    <p className="absolute bottom-1 right-1 text-slate-100 text-bold text-sm p-1 rounded-lg bg-black bg-opacity-80">{formatTime(video.duration)}</p>
                                                </div>
                                                <div className="w-[55%] px-2">
                                                    <p className="text-slate-100 text-sm line-clamp-2 max-w-[200px] break-words">{video.title}</p>
                                                    <p className="text-slate-100 text-opacity-50 text-xs">{formatNumbers(video.views)} views • {video.uploadedDate}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    })
                                }
                            </div>
                        }

                        {
                            tab === "livestreams" &&
                            <div ref={videoSectionRef} className="flex flex-col gap-4">
                                {
                                    videoStreamList.map((video, index) => {
                                        return <Link to={video.url} key={video.id}>
                                            <div className="flex w-full px-3">
                                                <div className="relative w-[45%]">
                                                    <img className="rounded-xl w-full min-h-[88px]" alt="video-thumb" src={video.thumbnail} />
                                                    <p className="absolute bottom-1 right-1 text-slate-100 text-bold text-sm p-1 rounded-lg bg-black bg-opacity-80">{formatTime(video.duration)}</p>
                                                </div>
                                                <div className="w-[55%] px-2">
                                                    <p className="text-slate-100 text-sm line-clamp-2 max-w-[200px] break-words">{video.title}</p>
                                                    <p className="text-slate-100 text-opacity-50 text-xs">{formatNumbers(video.views)} views • {video.uploadedDate}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    })
                                }
                            </div>
                        }

                        {
                            tab === "channels" &&
                            <div ref={videoSectionRef} className="flex flex-col gap-8">
                                {
                                    featuredChannels.map((channel, index) => {
                                        return <Link key={channel.id} to={channel.url}>
                                            <div className="flex">
                                                <div className="w-1/3 flex justify-center items-center">
                                                    <img className="w-16 h-16 rounded-full" src={channel.thumbnail} alt="channel-avatar" />
                                                </div>
                                                <div className="grow">
                                                    <p className="text-slate-100 line-clamp-1 text-sm">{channel.name}</p>
                                                    <p className="text-slate-100 line-clamp-1 text-opacity-50 text-xs">{formatNumbers(channel.subscribers)}</p>
                                                    <p className="text-slate-100 line-clamp-1 text-opacity-50 text-xs">{channel.videos} videos</p>
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