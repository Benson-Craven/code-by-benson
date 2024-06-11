import React from "react"
import Image from "next/image"

const HeroSectionII = () => {
    return (
        <section className="flex min-h-screen w-full flex-col justify-end rounded-md bg-neutral-100 p-10 font-helvetica text-slate-900">
            <h1 className="mx-4 mb-16 w-1/2 text-6xl tracking-tight text-black">
                Melbourne based{" "}
                <span className="inline-block">
                    <Image
                        src={"/images/portrait-bnw.JPG"}
                        alt="Portrait"
                        width={50}
                        height={50}
                        className="relative cursor-pointer overflow-hidden rounded-full"
                    />
                </span>{" "}
                developer crafting engaging, human-focused digital experiences
                for a range of forward-thinking brands.
            </h1>
            <div className="flex w-full justify-between px-5 pb-5 text-xl font-light">
                <div>
                    <p>
                        Freelance <br />
                        Front End Developer
                    </p>
                </div>
                <div className="flex space-x-10">
                    <p className="px-10">
                        Based in <br />
                        Melbourne
                    </p>
                    <p>
                        Get in touch <br />
                        <b>bensoncraven@hotmail.co.uk</b>
                    </p>
                </div>
            </div>
        </section>
    )
}

export default HeroSectionII
