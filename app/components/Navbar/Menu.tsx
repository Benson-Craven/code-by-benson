import { motion } from "framer-motion"
import { opacity, slideLeft, mountAnim } from "./anim"
import Link from "./Link"
import { useEffect } from "react"

const menu = [
    {
        title: "Projects",

        description: "To See Everything",

        images: ["projects1.jpg", "projects2.jpg"],
    },

    {
        title: "Info",

        description: "To Learn Everything",

        images: ["agence1.jpg", "agence2.jpg"],
    },

    {
        title: "Contact",

        description: "To Send a FAX",

        images: ["contact1.jpg", "contact2.jpg"],
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
                className="flex justify-center gap-3 p-5 text-white"
            >
                <a className="cursor-pointer rounded-3xl border-[1px] border-white px-4 py-1 text-[3vw] md:border-2 md:px-5 md:py-3">
                    FB
                </a>

                <a className="cursor-pointer rounded-3xl border-[1px] border-white px-4 py-1 text-[3vw] md:border-2 md:px-5 md:py-3">
                    IG
                </a>

                <a className="cursor-pointer rounded-3xl border-[1px] border-white px-4 py-1 text-[3vw] md:border-2 md:px-5 md:py-3">
                    IN
                </a>

                <a className="cursor-pointer rounded-3xl border-[1px] border-white px-4 py-1 text-[3vw] md:border-2 md:px-5 md:py-3">
                    BE
                </a>
            </motion.div>
        </div>
    )
}

export default Menu
