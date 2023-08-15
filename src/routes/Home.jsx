import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pipePlus } from "../apis";
import { VideoCard } from "../components";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { isValid } from "../utils";

export const Home = () => {
    const dispatch = useDispatch()
    const { sidepanelOpen } = useSelector((state) => state.app);
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
    }

    const fetchDummyFeed = async () => {
        let res = await pipePlus.feed.dummy();
        res.forEach((item) => {
            item.id = uuid();

            let streamId = item.url.split("=")[1];
            let highResThumbnail = `https://img.youtube.com/vi/${streamId}/maxresdefault.jpg`;
            item.thumbnail = highResThumbnail;
        });

        // only save 30 results
        res = res.slice(0, 30);

        setFeedStreams([...res]);
    }

    const fetchUserFeed = async () => {
        let subList = await pipePlus.user.subscriptions(user.id);

        if (subList.list.length === 0 || !isValid(subList.list)) {
            fetchTrendingStreams();
            return;
        }

        let res = await pipePlus.feed.userFeed(subList.list);
        res.forEach((item) => {
            item.id = uuid();

            let streamId = item.url.split("=")[1];
            let highResThumbnail = `https://img.youtube.com/vi/${streamId}/maxresdefault.jpg`;
            item.thumbnail = highResThumbnail;
        });

        // only save 30 results
        res = res.slice(0, 30);

        setFeedStreams([...res]);
    }

    const fetchFeed = async () => {
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
            <div className="w-full h-full grid grid-cols-1 lg:p-4 gap-5 home_page">
                {
                    feedStreams.length > 0 && feedStreams.map((item) => {
                        return <Link to={item.url} key={item.id}>
                            <VideoCard key={item.title} video={item} />
                        </Link>
                    })
                }
            </div>
        </div>
    )
}