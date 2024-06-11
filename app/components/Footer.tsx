import React from "react"

const Footer = () => {
    return (
        <footer>
            <section className="min-h-1/2 rounded-lg bg-white p-5 font-helvetica text-slate-900">
                <div className="mt-20">
                    <h1 className="text-3xl tracking-tight md:text-6xl">
                        ✺ Let's Chat
                    </h1>
                </div>
                <div className="mt-5 flex items-center justify-between">
                    <h3 className="text-l mx-7 font-mono italic md:text-2xl">
                        cravenbenson@gmail.com
                    </h3>
                    <div className="mb-10 flex text-[16px] font-light md:text-[21px]">
                        {["Github", "Behance", "Dribble"].map((text) => (
                            <p key={text} className="mx-4 font-helvetica">
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
