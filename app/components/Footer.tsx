import React from "react"
import { FaArrowRightLong } from "react-icons/fa6"

const Footer = () => {
    return (
        // <footer className="h-2/3 w-screen rounded-lg bg-black">
        //     <section className="p-10 font-helvetica text-white">
        //         <div className="mt-20">
        //             <h1 className="text-3xl tracking-tight md:text-6xl">
        //                 <span className="mx-4">✺</span> Let's Chat
        //             </h1>
        //         </div>
        //         <div className="mt-5 flex items-center justify-between">
        //             <h3 className="text-l mx-7 font-mono italic md:text-2xl">
        //                 cravenbenson@gmail.com
        //             </h3>
        //             <div className="mb-10 flex text-sm font-light md:text-base">
        //                 {["Github", "Behance", "Dribble"].map((text) => (
        //                     <p key={text} className="mx-4">
        //                         {text}
        //                     </p>
        //                 ))}
        //             </div>
        //         </div>
        //     </section>
        // </footer>
        <>
            <footer className="max-w-screen relative mx-auto flex flex-col flex-nowrap justify-center gap-3 overflow-hidden bg-black px-6 pb-5 pt-20">
                <div className="flex flex-col flex-nowrap gap-6 py-6">
                    <div className="relative flex flex-wrap justify-start text-base">
                        <h3 className="text-2xl text-slate-500">
                            Have a project in mind?
                        </h3>
                    </div>
                    <div className="flex flex-col text-5xl md:text-7xl">
                        <span>✺</span>
                        <h2 className="text-neutral-100">Let's Collaborate</h2>
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                        <h4 className="text-lg md:text-3xl">
                            bensoncraven@hotmail.co.uk
                        </h4>

                        <span className="fill-white pr-8">
                            <FaArrowRightLong />
                        </span>
                    </div>
                    <hr className="my-3 h-px border-0 bg-neutral-100/40" />
                    <div className="flex flex-col justify-between text-sm md:flex-row">
                        <div className="flex space-x-5">
                            <h4>Github</h4>
                            <h4>Dribble</h4>
                            <h4>Instagram</h4>
                        </div>
                        <div>
                            <p className="mt-4 text-sm md:mt-0">
                                &copy; Code by Benson
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer
