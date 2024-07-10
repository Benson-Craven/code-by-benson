import { motion, useAnimate } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"
import { mountAnim, rotateX } from "./anim"
import Link from "next/link"

interface LinkProps {
    data: {
        title: string
        description: string
        images: string
    }
    index: number
    closeMenu: () => void
}

interface SliderProps {
    images: string
    description: string
}

const MenuLink: React.FC<LinkProps> = ({ data, index, closeMenu }) => {
    const { title, description, images } = data
    const [scope, animate] = useAnimate()
    const outer = useRef(null)
    const inner = useRef(null)

    const animateIn = async (e: React.MouseEvent<HTMLDivElement>) => {
        const bounds = e.currentTarget.getBoundingClientRect()

        const direction = e.clientY < bounds.top + bounds.height / 2 ? -1 : 1

        await animate(
            outer.current,
            { top: `${direction * 100}%` },
            { duration: 0 },
        )
        await animate(
            inner.current,
            { top: `${-1 * direction * 100}%` },
            { duration: 0 },
        )

        animate(
            [outer.current, inner.current],
            { top: "0%" },
            { duration: 0.3 },
        )
    }

    const animateOut = (e: React.MouseEvent<HTMLDivElement>) => {
        const bounds = e.currentTarget.getBoundingClientRect()

        const direction = e.clientY < bounds.top + bounds.height / 2 ? -1 : 1

        animate(
            outer.current,
            { top: `${direction * 100}%` },
            { duration: 0.3 },
        )

        animate(
            inner.current,
            { top: `${-1 * direction * 100}%` },
            { duration: 0.3 },
        )
    }

    return (
        <Link href={`/${title.toLowerCase()}`}>
            <motion.div
                variants={rotateX}
                {...mountAnim}
                custom={index}
                // onMouseEnter={(e) => {
                //     animateIn(e)
                // }}
                // onMouseLeave={(e) => {
                //     animateOut(e)
                // }}
                onClick={() => {
                    closeMenu()
                }}
                ref={scope}
                className="mb-5 flex h-[9vw] w-screen origin-top cursor-pointer items-center justify-center border-t-[1px] p-2 hover:bg-[#D3FD50] hover:text-black"
            >
                <h1 className="w-full text-[7vw]">{title}</h1>

                <div
                    ref={outer}
                    className="pointer-events-none absolute flex h-full w-full overflow-hidden hover:opacity-100"
                >
                    {/* outer */}
                    <div
                        ref={inner}
                        className="absolute top-full flex h-full whitespace-nowrap bg-[#D3FD50]"
                    >
                        {/* inner */}
                        {[...Array(2)].map((_, index) => {
                            return (
                                <SliderContent
                                    key={index}
                                    images={images}
                                    description={description}
                                />
                            )
                        })}
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}

const SliderContent: React.FC<SliderProps> = ({ images, description }) => {
    return (
        <div className="animate-slider relative flex items-center opacity-0 transition-opacity duration-300 hover:opacity-100">
            {/* container */}
            <div className="relative ml-[1vw] mr-[1vw] flex h-[6vw] w-[16vw] overflow-hidden rounded-[3vw]">
                {/* imageContainer */}
                <Image
                    src={`/images/${images[0]}`}
                    fill
                    alt="image"
                    className="object-cover"
                />
            </div>
            <p className="text-black">{description}</p>
            <div className="relative ml-[1vw] mr-[1vw] flex h-[6vw] w-[16vw] overflow-hidden rounded-[3vw]">
                {/* <Image
                    src={`/images/${images[1]}`}
                    fill
                    alt="image"
                    className="object-cover"
                /> */}
            </div>
            <p className="text-black">{description}</p>
        </div>
    )
}

export default MenuLink
