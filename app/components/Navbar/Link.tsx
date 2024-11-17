import { motion, useAnimate } from "framer-motion"
import { mountAnim, rotateX } from "./anim"
import Link from "next/link"

interface LinkProps {
    data: {
        title: string
        description: string
        images: string
        url: string
    }
    index: number
    closeMenu: () => void
}

const MenuLink: React.FC<LinkProps> = ({ data, index, closeMenu }) => {
    const { title, url } = data
    const [scope] = useAnimate()

    return (
        <Link href={`${url.toLowerCase()}`}>
            <motion.div
                variants={rotateX}
                {...mountAnim}
                custom={index}
                onClick={() => {
                    closeMenu()
                }}
                ref={scope}
                className="group mb-8 flex w-full max-w-[300px] origin-top cursor-pointer items-center justify-center sm:w-[90%] md:w-[75%]"
            >
                <h1 className="relative px-6 py-3 text-[6vw] text-white transition-all duration-300 group-hover:rounded-full group-hover:bg-[#D3FD50] group-hover:text-black sm:text-[5.5vw] md:p-8 md:text-[5vw]">
                    {title}
                </h1>
            </motion.div>
        </Link>
    )
}

export default MenuLink
