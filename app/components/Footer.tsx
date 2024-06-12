import React from "react"

const Footer = () => {
    return (
        <footer className="h-2/3 rounded-lg bg-black">
            <section className="p-10 font-helvetica text-white">
                <div className="mt-20">
                    <h1 className="text-3xl tracking-tight md:text-6xl">
                        <span className="mx-4">✺</span> Let's Chat
                    </h1>
                </div>
                <div className="mt-5 flex items-center justify-between">
                    <h3 className="text-l mx-7 font-mono italic md:text-2xl">
                        cravenbenson@gmail.com
                    </h3>
                    <div className="mb-10 flex text-sm font-light md:text-base">
                        {["Github", "Behance", "Dribble"].map((text) => (
                            <p key={text} className="mx-4">
                                {text}
                            </p>
                        ))}
                    </div>
                </div>
            </section>
        </footer>
    )
}

export default Footer
