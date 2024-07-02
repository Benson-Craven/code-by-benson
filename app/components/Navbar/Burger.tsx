import React from "react"

interface Props {
    openMenu: () => void // Define the type of openMenu
}

const Button: React.FC<Props> = ({ openMenu }) => {
    return (
        <div
            onClick={() => {
                openMenu()
            }}
            className="group fixed right-0 top-0 flex h-[60px] w-[150px] cursor-pointer flex-col justify-end bg-black p-[10px] md:h-[120px]"
        >
            <div className="absolute left-0 top-0 z-[-1] h-0 w-full bg-[#D3FD50] transition-all duration-300 group-hover:h-full"></div>

            <svg
                width="56"
                height="7"
                viewBox="0 0 56 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute right-[20px] top-[20px]"
            >
                <line
                    x1="56"
                    y1="0.5"
                    x2="0"
                    y2="0.5"
                    className="stroke-white transition-all duration-500 group-hover:stroke-black"
                />
                <line
                    x1="56"
                    y1="6.5"
                    x2="28"
                    y2="6.5"
                    className="stroke-white transition-all duration-500 group-hover:stroke-black"
                />
            </svg>

            <p className="m-0 hidden uppercase text-white transition-all duration-500 group-hover:text-black md:block">
                Menu
            </p>
        </div>
    )
}

export default Button
