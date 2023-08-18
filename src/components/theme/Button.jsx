export const Button = ({ children, className, onClick, type }) => {
    return (
        <div onClick={onClick} className={`bg-[#272727] ${type === "white" ? "text-black bg-slate-100" : "text-slate-100"} lg:hover:bg-[#373737] flex gap-2 items-center justify-center w-fit h-fit px-2 lg:px-4 py-1  rounded-full cursor-pointer ${className}`}>
            {children}
        </div>
    )
}