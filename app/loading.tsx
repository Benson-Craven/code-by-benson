import React, { useEffect } from "react"

const loading = () => {
    // useEffect(() => {
    //     preLoaderAnim()
    // }, [])

    return (
        <div className="z-[55] flex h-[100vh] w-screen items-center justify-center overflow-hidden bg-black text-white">
            {/* preloader */}
            <div className="flex h-[60px] w-[200px] items-center justify-between overflow-hidden text-2xl">
                {/* texts-container */}
                <span>Code</span>
                <span>By</span>
                <span>Benson</span>
            </div>
        </div>
    )
}

export default loading
