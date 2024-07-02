import { motion } from "framer-motion"
import { mountAnim, rotateX } from "./anim"
import Link from "next/link"

interface Props {
    data: {
        title: string
        description: string
        images: string[]
    }
    index: number
}

const link: React.FC<Props> = ({ data, index }) => {
    const { title, description, images } = data

    return (
        <motion.div
            variants={rotateX}
            {...mountAnim}
            custom={index}
            className="mb-5 flex h-[9vw] w-full origin-top cursor-pointer items-center justify-center border-t-[1px] p-2"
        >
            <Link href={"/"} className="w-full text-[7vw]">
                {title}
            </Link>
        </motion.div>
    )
}

export default link
