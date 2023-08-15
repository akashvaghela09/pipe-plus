import { AiFillHome } from "react-icons/ai";
import { MdVideoLibrary, MdOutlinePermMedia } from "react-icons/md";
import { BsCollectionPlayFill } from "react-icons/bs";
import { BiTrendingUp } from "react-icons/bi";
import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <div className="fixed bottom-0 left-0 w-full h-fit bg-[#0f0f0f] lg:hidden flex justify-evenly border-t-[1px] border-[#313131] py-1">
            <Link to="/">
                <div className="active:bg-[#212121] rounded-xl flex flex-col justify-center items-center w-16 h-full p-1 gap-[2px] mt-[2px]">
                    <AiFillHome className="text-white text-lg" />
                    <p className="text-[10px] text-slate-100">Home</p>
                </div>
            </Link>
            <Link to="/trending">
                <div className="active:bg-[#212121] rounded-xl flex flex-col justify-center items-center w-16 h-full p-1 gap-[2px] mt-[2px]">
                    <BiTrendingUp className="text-white text-lg" />
                    <p className="text-[10px] text-slate-100">Trending</p>
                </div>
            </Link>
            <Link to="/subscriptions">
                <div className="active:bg-[#212121] rounded-xl flex flex-col justify-center items-center w-16 h-full p-1 gap-[2px] mt-[2px]">
                    <BsCollectionPlayFill className="text-white text-lg" />
                    <p className="text-[10px] text-slate-100">Subscriptions</p>
                </div>
            </Link>
            <Link to="/channel-groups">
                <div className="active:bg-[#212121] rounded-xl flex flex-col justify-center items-center w-16 h-full p-1 gap-[2px] mt-[2px]">
                    <MdOutlinePermMedia className="text-white text-lg" />
                    <p className="text-[10px] text-slate-100">Groups</p>
                </div>
            </Link>
            <Link to="/library">
                <div className="active:bg-[#212121] rounded-xl flex flex-col justify-center items-center w-16 h-full p-1 gap-[2px] mt-[2px]">
                    <MdVideoLibrary className="text-white text-lg" />
                    <p className="text-[10px] text-slate-100">Library</p>
                </div>
            </Link>
        </div>
    )
}