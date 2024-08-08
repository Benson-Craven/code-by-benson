import { motion, AnimatePresence } from "framer-motion"
import React, { useState } from "react"

const Process = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const items = [
        {
            number: "01",
            text: "Understand",
            content:
                "We start by getting to know you and your project. I’ll ask questions and dive into your vision to make sure I understand exactly what you're looking for and what your goals are.",
        },
        {
            number: "02",
            text: "Market & User Research",
            content:
                "Next, I'll do some research to see what’s happening in the market and what your users need. This helps us make sure the final product is not only fresh and innovative but also really useful for your audience.",
        },
        {
            number: "03",
            text: "Strategic Ideation",
            content:
                "With all the information gathered, we’ll brainstorm and come up with ideas together. This is where we turn insights into actionable plans and start shaping the project into something special.",
        },
        {
            number: "04",
            text: "Design Production",
            content:
                "I’ll then create designs that bring our ideas to life. You’ll see wireframes, mockups, and prototypes that show exactly how the project will look and feel, ensuring everything is just right before we move forward.",
        },
        {
            number: "05",
            text: "Code Development",
            content:
                "Once the design is set, I’ll get to work on building the site or app. This involves coding everything so it works smoothly and looks great on all devices. My goal is to make sure everything runs perfectly and efficiently.",
        },
        {
            number: "06",
            text: "Testing & Feedback",
            content:
                "Finally, we’ll test everything to catch any issues and make sure it works as intended. I’ll gather your feedback and make any necessary tweaks so that the final product is just what you envisioned.",
        },
    ]

    return (
        <section className="flex h-[100vh] flex-col items-center justify-center">
            <div className="w-full px-5">
                <div className="relative">
                    <h2 className="text-5xl tracking-tight mix-blend-difference">
                        Process
                    </h2>
                    <hr className="mt-5 h-[2px] w-full border-none bg-gray-300 mix-blend-difference" />
                    {/* title */}
                </div>
                <div className="flex p-8 md:justify-end">
                    <ul className="w-full tracking-tight mix-blend-difference md:w-2/3">
                        {items.map((item, index) => (
                            <motion.li
                                key={index}
                                className="flex cursor-pointer items-center justify-between border-b border-gray-300 py-4"
                                onClick={() =>
                                    setActiveIndex(
                                        activeIndex === index ? null : index,
                                    )
                                }
                            >
                                <div className="flex flex-col">
                                    <div className="flex items-center">
                                        <span className="mr-4 text-lg font-bold">
                                            {item.number}
                                        </span>
                                        <span className="text-2xl">
                                            {item.text}
                                        </span>
                                    </div>
                                    <AnimatePresence>
                                        {activeIndex === index && (
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    height: 0,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    height: "auto",
                                                }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="mt-4"
                                            >
                                                {item.content}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <span className="text-2xl font-light">
                                    {activeIndex === index ? "-" : "+"}
                                </span>
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default Process
