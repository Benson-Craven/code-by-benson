import { motion } from "framer-motion"
import { opacity, slideLeft, mountAnim } from "./anim"
import Link from "./Link"
import { useEffect } from "react"
import { FaGithub, FaLinkedin, FaBehance, FaDribbble } from "react-icons/fa6"

const menu = [
    {
        title: "Projects",

        description: "To See Everything",

        images: "projects2.jpg",

        url: "/#project-section",
    },

    {
        title: "Info",

        description: "To Learn Everything",

        images: "agence1.jpg",

        url: "/info",
    },

    {
        title: "Contact",

        description: "To Send a FAX",

        images: "contact1.jpg",

        url: "mailto:bensoncraven@hotmail.co.uk",
    },
]

interface Props {
    closeMenu: () => void // Define the type of openMenu
}

const Menu: React.FC<Props> = ({ closeMenu }) => {
    useEffect(() => {
        // Prevent scrolling on mount
        document.body.style.overflow = "hidden"
        return () => {
            // Re-enable scrolling on unmount
            document.body.style.overflow = ""
        }
    }, [])
    return (
        <div className="fixed left-0 top-0 z-20 m-0 flex h-[100vh] w-[100vw] flex-col justify-between">
            <div className="flex justify-end p-5">
                <motion.svg
                    variants={slideLeft}
                    {...mountAnim}
                    onClick={() => {
                        closeMenu()
                    }}
                    width={64}
                    height={64}
                    viewBox="0 0 68 68"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 cursor-pointer transition-colors duration-500 md:h-24 md:w-24 hover:[&>path]:stroke-[#D3FD50]"
                >
                    <path d="M1.5 1.5L67 67" stroke="white" />
                    <path d="M66.5 1L0.999997 66.5" stroke="white" />
                </motion.svg>
            </div>

            <div className="flex h-fit w-full flex-col items-center justify-center">
                {menu.map((el, index) => {
                    return (
                        <Link
                            data={el}
                            index={index}
                            key={index}
                            closeMenu={closeMenu}
                        />
                    )
                })}
            </div>

            <motion.div
                variants={opacity}
                {...mountAnim}
                custom={0.75}
                className="flex cursor-pointer justify-center gap-4 p-5 text-[3vw] text-white md:gap-6"
            >
                <FaGithub />
                <FaLinkedin />
                <FaBehance />
                <FaDribbble />
            </motion.div>
        </div>
    )
}

export default Menu
