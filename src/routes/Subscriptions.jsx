import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pipePlus } from "../apis";
import { Spinner, VideoCard } from "../components";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { setPageLoading } from "../redux/app/actions";

export const Subscriptions = () => {
    const dispatch = useDispatch();
    const { sidepanelOpen } = useSelector((state) => state.app);
    const { authStatus, user } = useSelector((state) => state.auth);
    const [feedStreams, setFeedStreams] = useState(null);
    const [userSubList, setUserSubList] = useState([]);
    const { pageLoading } = useSelector((state) => state.app);

    const fetchUserFeed = async () => {
        dispatch(setPageLoading(true));
        if (authStatus === null) {
            console.log("Not yet authenticated");
            dispatch(setPageLoading(false));
            return;
        }

        let subList = await pipePlus.user.subscriptions(user.id);

        if (subList.success === false) {
            dispatch(setPageLoading(false));
            return;
        }

        setUserSubList([...subList.list]);

        let idList = subList.list.map((item) => {
            return item.uploader_id;
        });

        // use set to remove duplicates
        idList = [...new Set(idList)];

        let res = await pipePlus.feed.subscriptionBased(idList);
        res.forEach((item) => {
            item.id = uuid();

            let streamId = item.url.split("=")[1];
            let highResThumbnail = `https://img.youtube.com/vi/${streamId}/maxresdefault.jpg`;
            item.thumbnail = highResThumbnail;
        });

        setFeedStreams([...res]);
        dispatch(setPageLoading(false));
    }

    useEffect(() => {
        fetchUserFeed();
    }, [authStatus])

    return (
        <div className="h-full w-full flex flex-col">
            {
                sidepanelOpen && <div className="w-[300px] hidden sm:border-spacing-0 md:flex" />
            }
            <div className="relative w-full h-full grid grid-cols-1 lg:p-4 gap-5 home_page">
                <div className="relative">
                    {
                        userSubList.length > 0 &&
                        <div className="lg:hidden relative overflow-auto whitespace-nowrap flex gap-1 px-1 items-center mt-2 scroll-hide pr-14">
                            {
                                userSubList.map((item) => {
                                    return <Link to={`/channel/${item.uploader_id}`} key={item.uuid}>
                                        <div className="h-16 w-16 flex-none flex items-center">
                                            <img src={item.avatar} className="h-14 w-14 rounded-full border-[1px] border-slate-400 border-opacity-10" />
                                        </div></Link>
                                })
                            }
                        </div>
                    }

                    <Link to="/subscriptions-list">
                        <div className="absolute bottom-0 right-0 h-16 p-2 bg-[#0f0f0f] flex justify-center items-center">
                            <p className="text-2xl text-bold text-[#3EA6FF]">All</p>
                        </div>
                    </Link>
                </div>
                {
                    feedStreams && feedStreams.length > 0 && feedStreams.map((item) => {
                        return <Link to={item.url} key={item.id}>
                            <VideoCard key={item.title} video={item} />
                        </Link>
                    })
                }
            </div>

            {
                pageLoading === false && feedStreams && feedStreams.length === 0 &&
                <div className="w-full h-full flex justify-center items-center">
                    <h1 className="text-2xl font-bold text-slate-100">No new videos</h1>
                </div>
            }

            {
                pageLoading === true &&
                <div className="h-screen w-full flex justify-center items-center">
                    <Spinner />
                </div>
            }
        </div>
    )
}