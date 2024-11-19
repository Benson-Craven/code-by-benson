import React from "react"
import { Ripple } from "react-css-spinners"

const loading = () => {
    // useEffect(() => {
    //     preLoaderAnim()
    // }, [])

    return (
        <div className="z-[55] flex h-[100vh] items-center justify-center">
            <Ripple color="#D3FD50" size={100} thickness={5} />
        </div>
    )
}

export default loading
