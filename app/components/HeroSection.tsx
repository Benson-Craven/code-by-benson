import React from "react"
import { Vortex } from "./Vortex"

const HeroSection = () => {
    return (
        <>
            <section className="relative min-h-screen overflow-hidden p-4 md:p-8 lg:p-16">
                <Vortex
                    backgroundColor="black"
                    className="absolute top-2 min-h-screen w-full"
                    particleCount={150}
                >
                    <div className="mx-4 my-5 font-helvetica">
                        <h1 className="text-4xl leading-tight md:text-[100px]">
                            Code by Benson
                            <span className="md:text-[50px]">&copy;</span>{" "}
                            <br /> UX Designer <br /> Developer
                        </h1>
                    </div>
                </Vortex>
                <div className="absolute bottom-20 left-10 w-1/3 bg-blue-500 p-5 font-helvetica text-white">
                    <p>
                        Lorem ipsum, dolor sit amet consectetur adipisicing
                        elit. Aliquam voluptatum perspiciatis voluptate.
                        Corrupti magni quisquam voluptates voluptatem incidunt
                        error aliquam accusantium perferendis labore in!
                        Possimus odit et beatae maxime laboriosam in dolor.
                        Explicabo ratione quo labore quaerat possimus aliquid
                        dolor unde aspernatur ipsam, voluptatum corrupti
                        asperiores placeat expedita repellat. Ullam?
                    </p>
                </div>
            </section>
        </>
    )
}

export default HeroSection
