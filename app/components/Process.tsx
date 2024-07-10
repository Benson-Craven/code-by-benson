import React, { useState } from "react"

const Process = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const items = [
        {
            number: "01",
            text: "Understand",
            content:
                "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptates, quas similique sed rerum ab porro commodi illo unde sint tenetur.",
        },
        {
            number: "02",
            text: "Market & User Research",
            content:
                "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptates, quas similique sed rerum ab porro commodi illo unde sint tenetur.",
        },
        {
            number: "03",
            text: "Strategic Ideation",
            content:
                "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptates, quas similique sed rerum ab porro commodi illo unde sint tenetur.",
        },
        {
            number: "04",
            text: "Design Production",
            content:
                "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptates, quas similique sed rerum ab porro commodi illo unde sint tenetur.",
        },
        {
            number: "05",
            text: "Code Development",
            content:
                "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptates, quas similique sed rerum ab porro commodi illo unde sint tenetur.",
        },
        {
            number: "06",
            text: "Testing & Feedback",
            content:
                "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptates, quas similique sed rerum ab porro commodi illo unde sint tenetur.",
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
                    {" "}
                    <ul className="w-full tracking-tight mix-blend-difference md:w-2/3">
                        {items.map((item, index) => (
                            <li
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
                                    {activeIndex === index && (
                                        <div className="mt-4">
                                            {item.content}
                                        </div>
                                    )}
                                </div>
                                <span className="text-2xl font-light">
                                    {activeIndex === index ? "-" : "+"}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default Process
