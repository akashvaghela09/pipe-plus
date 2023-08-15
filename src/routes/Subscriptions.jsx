import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { pipePlus } from "../apis";
import { VideoCard } from "../components";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";

export const Subscriptions = () => {
    const { sidepanelOpen } = useSelector((state) => state.app);
    const { authStatus, user } = useSelector((state) => state.auth);
    const [feedStreams, setFeedStreams] = useState([]);

    const fetchUserFeed = async () => {
        if (authStatus === null) {
            console.log("Not yet authenticated");
            return;
        }

        let subList = await pipePlus.user.subscriptions(user.id);

        let res = await pipePlus.feed.userFeed(subList.list);
        res.forEach((item) => {
            item.id = uuid();

            let streamId = item.url.split("=")[1];
            let highResThumbnail = `https://img.youtube.com/vi/${streamId}/maxresdefault.jpg`;
            item.thumbnail = highResThumbnail;
        });

        setFeedStreams([...res]);
    }

    useEffect(() => {
        fetchUserFeed();
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

                {
                    feedStreams.length === 0 && <div className="w-full h-full flex justify-center items-center">
                        <h1 className="text-2xl font-bold text-slate-100">No new videos</h1>
                    </div>
                }
            </div>
        </div>
    )
}