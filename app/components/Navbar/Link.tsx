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
                className="mb-5 flex h-[9vw] w-screen origin-top cursor-pointer items-center justify-center border-t-[1px] p-2 duration-300 hover:border-black hover:bg-[#D3FD50] hover:text-black"
            >
                <h1 className="w-full text-[7vw]">{title}</h1>
            </motion.div>
        </Link>
    )
}

export default MenuLink
