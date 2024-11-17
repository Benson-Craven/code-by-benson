import { motion, useAnimation } from "framer-motion"
import { opacity, slideLeft, slideRight, mountAnim } from "./anim"
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

        description: "About Me",

        images: "agence1.jpg",

        url: "/info",
    },

    {
        title: "Contact",

        description: "Send a message",

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
    const controls = useAnimation()

    const handleClick = () => {
        // Animate the SVG to move right when clicked
        controls.start({ x: "100%" })
        closeMenu()
    }
    return (
        <div className="fixed left-0 top-0 z-20 m-0 flex h-[100vh] w-[100vw] flex-col justify-between">
            <motion.div
                className="flex justify-end p-5"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div
                    onClick={handleClick}
                    className="group fixed right-4 top-4 flex cursor-pointer items-center justify-center rounded-full bg-black p-3 sm:h-[100px] sm:w-[100px] md:h-[150px] md:w-[150px]"
                >
                    {/* Hover Effect Background */}
                    <motion.div
                        className="absolute left-0 top-0 z-[-1] h-0 w-full rounded-full bg-[#D3FD50]"
                        initial={{ height: "0%" }}
                        whileHover={{ height: "100%" }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    ></motion.div>

                    {/* Animated SVG (Close Icon) */}
                    <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-12 w-12 cursor-pointer text-white transition-transform duration-300 hover:rotate-90 hover:text-[#D3FD50] sm:h-14 sm:w-14 md:h-16 md:w-16"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </motion.svg>
                </div>
            </motion.div>

            {/* SVG Movement to the Right on Click */}
            <motion.div
                className="fixed right-0 top-0 z-20"
                animate={controls} // Use animation controls
                transition={{ duration: 0.2, ease: "easeOut" }}
            />

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
                className="z-20 flex cursor-pointer items-center justify-center gap-4 p-5 text-[3vw] text-white md:gap-6"
            >
                <FaGithub className="h-10 w-10 duration-300 hover:text-[#D3FD50]" />
                <FaLinkedin className="h-10 w-10 duration-300 hover:text-[#D3FD50]" />
            </motion.div>
        </div>
    )
}

export default Menu
