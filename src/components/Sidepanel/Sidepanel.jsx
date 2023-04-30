import React, { useEffect, useState } from 'react';
import { AiFillHome } from 'react-icons/ai';
import { MdOutlineWifiProtectedSetup, MdVideoLibrary, MdOutlineWatchLater, MdOutlinePermMedia, MdOutlinePlaylistPlay } from 'react-icons/md';
import { BsCollectionPlayFill } from 'react-icons/bs';
import { SiYoutubemusic } from 'react-icons/si';
import { GoHistory } from 'react-icons/go';
import { BiSolidDownload, BiLike } from 'react-icons/bi';
import { MenuWrapper } from '../';
import { useLocation } from 'react-router-dom';

export const Sidepanel = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const [sidepanelVisible, setSidepanelVisible] = useState(true);

    let primaryOptions = [
        {
            name: 'Home',
            icon: <AiFillHome />,
            route: '/'
        },
        {
            name: "Shorts",
            icon: <MdOutlineWifiProtectedSetup />,
            route: '/shorts'
        },
        {
            name: "subscriptions",
            icon: <BsCollectionPlayFill />,
            route: '/subscriptions'
        },
        {
            name: "Youtube Music",
            icon: <SiYoutubemusic />,
            route: '/music'
        },
        {
            name: "Channel Groups",
            icon: <MdOutlinePermMedia />,
            route: '/channel-groups'
        }
    ]

    let secondaryOptions = [
        {
            name: "Library",
            icon: <MdVideoLibrary />,
            route: '/library'
        },
        {
            name: "History",
            icon: <GoHistory />,
            route: '/history'
        },
        {
            name: "Watch Later",
            icon: <MdOutlineWatchLater />,
            route: '/watch-later'
        },
        {
            name: "Downloads",
            icon: <BiSolidDownload />,
            route: '/downloads'
        },
        {
            name: "Liked Videos",
            icon: <BiLike />,
            route: '/liked-videos'
        }
    ]

    let playlists = [
        {
            name: "React playlist",
            icon: <MdOutlinePlaylistPlay />,
            route: '/'
        },
        {
            name: "HTML playlist",
            icon: <MdOutlinePlaylistPlay />,
            route: '/'
        },
        {
            name: "React Native playlist",
            icon: <MdOutlinePlaylistPlay />,
            route: '/'
        },
        {
            name: "JavaScript playlist",
            icon: <MdOutlinePlaylistPlay />,
            route: '/'
        }
    ]

    useEffect(() => {
        if (currentPath !== '/') {
            // setSidepanelVisible(false);
        } else {
            setSidepanelVisible(true);
        }
    }, [currentPath]);

    return (
        <div className='w-[270px] flex flex-col pt-2 overflow-hidden' style={{ width: sidepanelVisible === true ? "270px" : "0px" }}>
            {
                primaryOptions.map((option, index) => {
                    return (
                        <MenuWrapper text={option.name} route={option.route} key={index}>
                            {option.icon}
                        </MenuWrapper>
                    )
                })
            }

            <div className='border-t-[1px] border-t-[#272727] m-2' />

            {
                secondaryOptions.map((option, index) => {
                    return (
                        <MenuWrapper text={option.name} route={option.route} key={index}>
                            {option.icon}
                        </MenuWrapper>
                    )
                })
            }

            <div className='border-t-[1px] border-t-[#272727] m-2' />

            {
                playlists.map((option, index) => {
                    return (
                        <MenuWrapper text={option.name} route={option.route} key={index}>
                            {option.icon}
                        </MenuWrapper>
                    )
                })
            }
        </div>
    )
}