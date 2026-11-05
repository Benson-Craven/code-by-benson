import type { ReactNode } from "react"

type BrowserFrameProps = {
    // A neutral host label keeps the chrome readable without claiming a
    // destination the project does not publish.
    label: string
    children: ReactNode
}

// The reference presents every screenshot inside a small browser chrome with a
// dithered offset shadow, so the work reads as real interface captures rather
// than loose images.
export default function BrowserFrame({ label, children }: BrowserFrameProps) {
    return (
        <div className="relative">
            <span
                className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-xl bg-[conic-gradient(#0b0b0c_25%,transparent_0_50%,#0b0b0c_0_75%,transparent_0)] bg-[length:4px_4px] opacity-50"
                aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-xl border border-[rgb(11_11_12_/_0.15)] bg-preview-white">
                <div
                    className="relative flex h-8 items-center gap-1.5 border-b border-[rgb(11_11_12_/_0.1)] px-3 md:h-9"
                    aria-hidden="true"
                >
                    <span className="h-2 w-2 rounded-full bg-[rgb(11_11_12_/_0.15)] md:h-2.5 md:w-2.5" />
                    <span className="h-2 w-2 rounded-full bg-[rgb(11_11_12_/_0.15)] md:h-2.5 md:w-2.5" />
                    <span className="h-2 w-2 rounded-full bg-[rgb(11_11_12_/_0.15)] md:h-2.5 md:w-2.5" />
                    <span className="absolute left-1/2 max-w-[62%] -translate-x-1/2 overflow-hidden text-ellipsis whitespace-nowrap rounded-full bg-[rgb(11_11_12_/_0.05)] px-3 py-0.5 text-[11px] font-medium text-[rgb(11_11_12_/_0.6)]">
                        {label}
                    </span>
                </div>
                <div className="group/media relative [&>img]:block [&>img]:aspect-[16/10] [&>img]:w-full [&>img]:bg-[#e6e6e0] [&>img]:object-cover [&>img]:object-top [&>video]:block [&>video]:aspect-video [&>video]:w-full [&>video]:bg-preview-black [&>video]:object-cover [&>video]:object-top">
                    {children}
                </div>
            </div>
        </div>
    )
}
