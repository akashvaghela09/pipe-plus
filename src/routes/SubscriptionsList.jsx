import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pipePlus } from "../apis";
import { Button, Spinner, VideoCard } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { setPageLoading } from "../redux/app/actions";
import { isValid } from "../utils";

export const SubscriptionsList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { pageLoading } = useSelector(state => state.app);
    const { user, authStatus } = useSelector(state => state.auth);

    const [subscriptions, setSubscriptions] = useState([]);

    const fetchSubscriptions = async () => {
        if (!isValid(user.id)) {
            return;
        }

        dispatch(setPageLoading(true));

        const res = await pipePlus.user.subscriptions(user.id);

        if (res.success === false) {
            dispatch(setPageLoading(false));
            return;
        }

        let list = res.list.map((item) => {
            item.id = uuid();
            item.subscribed = true;
            return item;
        })

        setSubscriptions([...list]);
        dispatch(setPageLoading(false));
    };

    const handleChannelSubscribe = async (channel) => {
        validate();

        if(!isValid(user?.id)) {
            return;
        }

        let list = subscriptions.map((item) => {
            if(item.uploader_id === channel.uploader_id) {
                item.subscribed = true;
            }

            return item;
        })

        setSubscriptions([...list]);

        let data = {
            created_at: new Date(),
            uuid: uuid(),
            uploader_id: channel.uploader_id,
            name: channel.name,
            avatar: channel.avatar,
            feed_allowed: true,
            user_id: user.id
        }

        let res = await pipePlus.channel.subscribe(data);
    }

    const handleChannelUnSubscribe = async (channel) => {
        
        validate();

        if(!isValid(user?.id)) {
            return;
        }

        let list = subscriptions.map((item) => {
            if(item.uploader_id === channel) {
                item.subscribed = false;
            }

            return item;
        })

        setSubscriptions([...list]);

        let res = await pipePlus.channel.unsubscribe(user.id, channel);
    }

    const validate = async () => {
        if (!authStatus) {
            alert("Please login to subscribe to this channel")
            navigate('/signin');
        }
    }

    useEffect(() => {
        fetchSubscriptions();
    }, [user.id]);

    return (
        <div className="h-full w-full flex flex-col">
            <div className="flex flex-col gap-4 p-3">
                {
                    subscriptions.length > 0 &&
                    subscriptions.map((item => {
                        return (
                            <div key={item.id} className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <img className="h-14 w-14 rounded-full border-[1px] border-slate-400 border-opacity-10" src={item.avatar} alt="channel-avatar" />
                                    <p className="text-slate-100 text-sm line-clamp-2 break-words">{item.name}</p>
                                </div>
                                {
                                    item.subscribed === true ?
                                        <Button onClick={() => handleChannelUnSubscribe(item.uploader_id)}>Unsubscribe</Button>
                                        :
                                        <Button type="white" onClick={() => handleChannelSubscribe(item)}>Subscribe</Button>
                                }
                            </div>
                        )
                    }))
                }
            </div>

            {
                pageLoading === true &&
                <div className="h-screen w-full flex justify-center items-center">
                    <Spinner />
                </div>
            }
        </div>
    )
}