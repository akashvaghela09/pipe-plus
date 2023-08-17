import { useSearchParams } from "react-router-dom";
import { Button, CommentSection, DescriptionCard, DescriptionWithTitle, Player, SuggestionCard, VideoCard } from "../components";
import { useEffect, useState } from "react";
import { pipePlus } from "../apis";
import { useDispatch, useSelector } from "react-redux";
import { setAutoPlayRequest, setAvailableQualities, setCommentData, setPlayStatus, setPrevProgress, setStreamLoading, setStreamMetadata, setStreamPlayed, setStreamSource, setStreamUUID, setStreamValues } from "../redux/player/actions";
import { v4 as uuid } from 'uuid';
import { formatNumbers, getUser, isValid } from "../utils";
import { TiTick } from 'react-icons/ti';
import { BiSolidDownload, BiLike, BiDislike } from 'react-icons/bi';
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../configs/supabase-config";

export const Watch = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const streamId = searchParams.get('v')
    const [isDescriptionOpen, setDescriptionOpen] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    const { authStatus, user } = useSelector(state => state.auth);
    const { streamMetadata, selectedQuality, streamSource, videoPlayer, audioPlayer, streamValues } = useSelector(state => state.player);
    const {
        title,
        thumbnailUrl,
        category,
        description,
        duration,
        uploaderAvatar,
        uploader,
        uploaderUrl,
        uploaderSubscriberCount,
        likes,
        dislikes,
        views,
        uploadDate,
        relatedStreams
    } = streamMetadata;

    const handleVideoId = async () => {
        let res = await pipePlus.stream.get(streamId);
        const { videoStreams } = res;

        // TODO : remove this in future        
        let signleStreams = videoStreams.filter((item) => {
            // filter out/remove streams with audio 
            return item.videoOnly === false && item.mimeType === "video/mp4";
        })
        res.videoStreams = signleStreams;

        // prepare stream resources 
        let listOfStreams = {};

        for (let i = 0; i < signleStreams.length; i++) {
            let stream = signleStreams[i];

            if (listOfStreams[stream.quality]) {
                listOfStreams[stream.quality].push(stream);
            } else {
                listOfStreams[stream.quality] = [stream];
            }
        }

        let availableQuality = Object.keys(listOfStreams);
        let streamSource = {};
        let qualityList = []

        if (selectedQuality) {
            streamSource = listOfStreams[selectedQuality][0];
        } else {
            streamSource = listOfStreams[availableQuality[0]][0];
        }

        for (let i = 0; i < availableQuality.length; i++) {
            let obj = {};
            obj.id = uuid();
            obj.quality = availableQuality[i];

            qualityList.push(obj);
        }

        let newMetaData = { ...res, playableStreams: listOfStreams };
        // console.log("New Meta Data : ", newMetaData);
        dispatch(setStreamSource(streamSource));
        dispatch(setAvailableQualities(qualityList));
        dispatch(setStreamMetadata(newMetaData));

        return newMetaData;
    }

    const handleStreamChange = () => {
        dispatch(setPlayStatus(false));
        dispatch(setStreamLoading(true));
        dispatch(setAutoPlayRequest(true));

        resetStreamMetadata();
    }

    const resetStreamMetadata = () => {

        dispatch(setStreamValues({
            seek: 0,
            duration: 0,
            loaded: 0,
            loadedSeconds: 0,
            played: 0,
            playedSeconds: 0
        }))

        dispatch(setStreamMetadata({
            audioStreams: [],
            category: "",
            chapters: [],
            description: "",
            dislikes: 0,
            duration: 0,
            likes: 0,
            livestream: false,
            previewFrames: [],
            playableStreams: {},
            relatedStreams: [],
            subtitles: [],
            thumbnailUrl: "",
            title: "",
            uploadDate: "",
            uploader: "",
            uploaderAvatar: "",
            uploaderSubscriberCount: 0,
            uploaderUrl: "",
            videoStreams: [],
            views: 0
        }))

        dispatch(setAvailableQualities([]));

        dispatch(setStreamSource({}));

        dispatch(setStreamPlayed(0))

        // dispatch(setCommentData({
        //     list: [],
        //     count: 0,
        //     replyIndex: -1,
        //     isLoading: false,
        //     nextPage: null,
        // }))

        dispatch(setStreamUUID(""));

        dispatch(setPrevProgress(0));
    }

    const handleChannelSubscribe = async () => {
        validate();

        let uploader_id = uploaderUrl.split("/").pop();
        let data = {
            created_at: new Date(),
            uuid: uuid(),
            uploader_id: uploader_id,
            name: uploader,
            avatar: uploaderAvatar,
            feed_allowed: true,
            user_id: user.id
        }

        let res = await pipePlus.channel.subscribe(data);

        if (res.subscribed === true) {
            setIsSubscribed(true);
        }
    }

    const handleChannelUnSubscribe = async () => {
        validate();

        let uploader_id = uploaderUrl.split("/").pop();

        let res = await pipePlus.channel.unsubscribe(user.id, uploader_id);

        if (res.unsubscribed === true) {
            setIsSubscribed(false);
        }
    }

    const validate = async () => {
        if (!authStatus) {
            alert("Please login to subscribe to this channel")
            navigate('/signin');
        }
    }

    const handleTest = async (streamId, userId) => {
        // let streamData = {
        //     created_at: new Date(),
        //     title: title,
        //     views: views,
        //     upload_date: uploadDate,
        //     duration: duration,
        //     thumbnail: thumbnailUrl,
        //     uploader: uploader,
        //     uploader_avatar: uploaderAvatar,
        //     uuid: uuid(),
        //     user_id: userId,
        //     watched: false,
        //     watch_later: false,
        //     liked: false,
        //     category: category,
        //     progress: 0,
        //     stream_id: streamId
        // };

        // let res = await pipePlus.addNewStreamPlayed({streamData});

        ///////////////////////////////////////////////////////////////////////////////////////

        // let params = {
        //     streamUuid: "a1652cc3-1c59-4717-92ad-84ce052d4d93",
        //     progressAmount: 10
        // }
        // let res = await pipePlus.updateStreamPlayed(params);

        ///////////////////////////////////////////////////////////////////////////////////////
        // let uuid = "a1652cc3-1c59-4717-92ad-84ce052d4d93"
        // let res = await pipePlus.removeStreamFromHistory(uuid);

        // console.log("Response : ", res);

        ///////////////////////////////////////////////////////////////////////////////////////
        //   let uuid = "a1652cc3-1c59-4717-92ad-84ce052d4d93"
        //   let res = await pipePlus.removeStreamFromHistory(uuid);

        //   console.log("Response : ", res);

        ///////////////////////////////////////////////////////////////////////////////////////
        // let params = {
        //     streamUuid: "a1652cc3-1c59-4717-92ad-84ce052d4d93",
        //     progressAmount: 10
        // }
        // let res = await pipePlus.watchLaterRemove(params);

        // console.log("Response : ", res);

        // ///////////////////////////////////////////////////////////////////////////////////////
        // let params = {
        //     user_id: user.id,
        //     created_at: new Date(),
        //     uuid: uuid(),
        //     name: "Test",
        //     url_list: ["url--id--1", "url--id--2", "url--id--3", "url--id--4", "url--id--5"],
        //     modified_at: new Date(),
        // };

        // let res = await pipePlus.createChannelGroup(params);
        // console.log("Response : ", res);

        // ///////////////////////////////////////////////////////////////////////////////////////
        // let params = {
        //     uuid: "68128137-ef17-447b-bf0c-8cc762146b45",
        //     name: "Test Updated",
        // };

        // let res = await pipePlus.renameChannelGroup(params);
        // console.log("Response : ", res);

        ///////////////////////////////////////////////////////////////////////////////////////
        // let params = {
        //     uuid: "68128137-ef17-447b-bf0c-8cc762146b45",
        // };

        // let res = await pipePlus.deleteChannelGroup(params);
        // console.log("Response : ", res);

        ///////////////////////////////////////////////////////////////////////////////////////
        // let params = {
        //     uuid: "5be8e565-a96b-4de1-bb1b-a013928414f9",
        //     url: "url--XXX",
        // };

        // let res = await pipePlus.group.addItem(params);
        // console.log("Response : ", res);

    }

    const handleStreamPlayed = async (data) => {
        const { title, views, uploadDate, duration, thumbnailUrl, uploader, uploaderAvatar, category } = data;

        if (!isValid(user.id) || !isValid(streamId)) {
            return;
        }

        // Add stream to played list
        let params = {
            created_at: new Date(),
            title: title,
            views: views,
            upload_date: uploadDate,
            duration: duration,
            thumbnail: thumbnailUrl,
            uploader: uploader,
            uploader_avatar: uploaderAvatar,
            uuid: uuid(),
            user_id: user.id,
            watched: false,
            watch_later: false,
            liked: false,
            category: category,
            progress: 0,
            stream_id: streamId
        };

        let newRes = await pipePlus.stream.addPlayed(params);
        let progress = newRes?.progress;
        let streamUuid = newRes?.data[0]?.uuid;

        dispatch(setPrevProgress(progress));
        dispatch(setStreamUUID(streamUuid));
    }

    const updateStreamState = async () => {
        resetStreamMetadata();
        let dataRes = await handleVideoId();
        await handleStreamPlayed(dataRes);
        await checkSubscription(dataRes.uploaderUrl);
    }

    const handleDescriptionExpand = (value) => {
        setDescriptionOpen(value)
    }

    const checkSubscription = async (channelUrl) => {
        if (!isValid(user.id) || !isValid(channelUrl)) {
            return;
        }

        let uploader_id = channelUrl.split("/").pop();
        let res = await pipePlus.channel.isSubscribed(user.id, uploader_id);

        if (res.subscribed === true) {
            setIsSubscribed(true);
        }
    }

    useEffect(() => {
        updateStreamState()
    }, [streamId, user])

    return (
        <div className="w-full md:w-10/12 md:max-w-10/12 lg:pt-6 flex flex-col lg:flex-row justify-center">
            <div className="grow flex flex-col lg:gap-4">
                {/* Player section */}
                <Player />

                {/* Stream Metadata section */}
                <div className="relative flex flex-col p-2 gap-1">
                    <p className="text-slate-100 text-xl font-medium font-sans line-clamp-2 hidden lg:flex">{title}</p>

                    <div className="lg:hidden">
                        {/* Description For small screens */}
                        <DescriptionWithTitle
                            title={title}
                            views={views}
                            likes={likes}
                            uploadDate={uploadDate}
                            description={description}
                            isDescriptionOpen={isDescriptionOpen}
                            handleDescriptionExpand={handleDescriptionExpand}
                        />
                    </div>

                    {
                        isDescriptionOpen === false &&
                        <div className="flex flex-col gap-1 lg:flex-row w-full justify-between items-center">
                            <div className="py-2 w-full flex justify-between items-center">
                                <Link to={`${uploaderUrl}`}>
                                    <div className="flex gap-3 w-full justify-between items-center">
                                        <img loading="lazy" src={uploaderAvatar} className="rounded-full w-7 h-7" />
                                        <div className="flex gap-2 lg:flex-col justify-center items-center">
                                            <div className="flex items-center gap-2">
                                                <p className="text-slate-200 font-bold lg:text-sm items-baseline line-clamp-1">{uploader} </p>
                                                <TiTick className="bg-slate-50 bg-opacity-50 rounded-full text-xs hidden lg:flex" />
                                            </div>
                                            <span className="text-opacity-50 lg:text-opacity-100 text-slate-200 text-sm flex"><p className="p-2">{formatNumbers(uploaderSubscriberCount)}</p> <p className="hidden lg:flex">subscribers</p></span>
                                        </div>
                                    </div>
                                </Link>
                                {
                                    isSubscribed === true ?
                                        <Button className="text-sm" onClick={() => handleChannelUnSubscribe()}>
                                            Unsubscribe
                                        </Button>
                                        :
                                        <Button type="white" className="bg-slate-100 text-black text-sm" onClick={() => handleChannelSubscribe()}>
                                            Subscribe
                                        </Button>
                                }
                            </div>
                            <div className="flex w-full justify-between lg:gap-4">
                                <Button className="text-sm lg:text-xl">
                                    <BiLike className="" />
                                    {formatNumbers(likes)}
                                </Button>
                                <Button className="text-sm lg:text-xl">
                                    <BiDislike className="" />
                                    {formatNumbers(dislikes)}
                                </Button>
                                <Button className="text-sm lg:text-xl">
                                    <BiSolidDownload className="" />
                                    Download
                                </Button>
                                <Button className="text-sm lg:text-xl">
                                    <BiSolidDownload className="" />
                                    Share
                                </Button>
                            </div>
                        </div>

                    }
                    <div className="w-full hidden lg:flex">
                        <DescriptionCard
                            views={views}
                            uploadDate={uploadDate}
                            description={description}
                        />
                    </div>

                    <CommentSection streamId={streamId} />
                </div>
            </div>
            {
                isDescriptionOpen === false &&
                <div className="hidden max-w-[50%] w-[450px] h-fit pl-5 lg:flex flex-col gap-4">
                    {
                        relatedStreams.length > 0 && relatedStreams.map((item) => {
                            return <Link to={item.url} key={uuid()} >
                                <div onClick={() => handleStreamChange()}>
                                    <SuggestionCard video={item} size="sm" />
                                </div>
                            </Link>
                        })
                    }
                </div>
            }
            <div className="w-full h-full grid grid-cols-1 p-4 gap-5 lg:hidden">
                {
                    relatedStreams.length > 0 && relatedStreams.map((item) => {
                        return <Link to={item.url} key={uuid()} >
                            <div onClick={() => handleStreamChange()}>
                                <VideoCard video={item} quality="high" />
                            </div>
                        </Link>
                    })
                }
            </div>
        </div>
    )
}