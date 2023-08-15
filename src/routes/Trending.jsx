import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { pipePlus } from "../apis";
import { VideoCard } from "../components";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";

export const Trending = () => {
    const { sidepanelOpen } = useSelector((state) => state.app);
    const [feedStreams, setFeedStreams] = useState([]);

    const fetchTrendingStreams = async () => {
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

    useEffect(() => {
        fetchTrendingStreams();
    }, [])

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