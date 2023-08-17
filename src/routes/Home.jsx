import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pipePlus } from "../apis";
import { Spinner, VideoCard } from "../components";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { isValid } from "../utils";
import { setPageLoading } from "../redux/app/actions";

export const Home = () => {
    const dispatch = useDispatch()
    const { sidepanelOpen, pageLoading } = useSelector((state) => state.app);
    const { authStatus, user } = useSelector((state) => state.auth);
    const [feedStreams, setFeedStreams] = useState([]);

    const fetchTrendingStreams = async () => {
        if (authStatus === null) {
            console.log("Not yet authenticated");
            return;
        }

        try {
            let res = await pipePlus.feed.trending("IN");
            res.forEach((item) => {
                item.id = uuid();
            });

            setFeedStreams(res);
        } catch (error) {
            console.log("Something went wrong");
        }

        dispatch(setPageLoading(false));
    }

    const fetchDummyFeed = async () => {
        dispatch(setPageLoading(true));
        let res = await pipePlus.feed.dummy();

        if(!isValid(res)){
            dispatch(setPageLoading(false));
            return;
        }

        res.forEach((item) => {
            item.id = uuid();

            let streamId = item.url.split("=")[1];
            let highResThumbnail = `https://img.youtube.com/vi/${streamId}/maxresdefault.jpg`;
            item.thumbnail = highResThumbnail;
        });

        // only save 30 results
        res = res.slice(0, 30);

        setFeedStreams([...res]);

        dispatch(setPageLoading(false));
    }

    const fetchUserFeed = async () => {
        dispatch(setPageLoading(true));
        let subList = await pipePlus.user.subscriptions(user.id);
        if (subList.list.length === 0 || !isValid(subList.list)) {
            fetchTrendingStreams();
            return;
        }

        let idList = subList.list.map((item) => {
            return item.uploader_id;
        });

        // use set to remove duplicates
        idList = [...new Set(idList)];

        let res = await pipePlus.feed.suggestionBased(idList);

        if(!isValid(res.data)){
            dispatch(setPageLoading(false));
            return;
        }

        res.data.forEach((item) => {
            item.id = uuid();
            // if(item.url){
            //     let streamId = item.url.split("=")[1];
            //     let highResThumbnail = `https://img.youtube.com/vi/${streamId}/maxresdefault.jpg`;
            //     item.thumbnail = highResThumbnail;
            // }
        });

        setFeedStreams([...res.data]);

        window.scrollTo(0, 0);
        dispatch(setPageLoading(false));
    }

    const fetchFeed = async () => {
        window.scrollTo(0, 0);

        if (authStatus === null) {
            console.log("Not yet authenticated");
            return;
        }

        if (authStatus === false) {
            fetchDummyFeed();
            return;
        } else if (authStatus === true) {
            fetchUserFeed();
            return;
        }
    }

    useEffect(() => {
        fetchFeed();
    }, [authStatus])

    return (
        <div className="h-full w-full flex">
            {
                sidepanelOpen && <div className="w-[300px] hidden sm:border-spacing-0 md:flex" />
            }
            {
                pageLoading === true ?
                    <div className="h-screen w-full flex justify-center items-center">
                        <Spinner />
                    </div> :
                    <div className="w-full h-full grid grid-cols-1 lg:p-4 gap-5 home_page">
                        {
                            feedStreams.length > 0 && feedStreams.map((item) => {
                                return <Link to={item.url} key={item.id}>
                                    <VideoCard key={item.title} video={item} />
                                </Link>
                            })
                        }
                    </div>
            }
        </div>
    )
}