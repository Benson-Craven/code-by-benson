import Image from "next/image"
import type { Project } from "@/app/data/projects"

type ProjectVisualProps = {
    project: Project
}

export default function ProjectVisual({ project }: ProjectVisualProps) {
    if (project.visualType === "image" && project.image) {
        return (
            <div className="project-visual group relative min-h-[340px] overflow-hidden bg-muted md:min-h-[520px]">
                <Image
                    src={project.image.src}
                    alt={project.image.alt}
                    fill
                    sizes="(min-width: 1024px) 54vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,23,20,0.06),rgba(23,23,20,0))]" />
            </div>
        )
    }

    if (project.visualType === "market") {
        return <MarketPreview />
    }

    return <WaxlistPreview />
}

function MarketPreview() {
    const rows = [
        ["AAPL", "214.08", "+0.84"],
        ["TSLA", "251.77", "-1.12"],
        ["NVDA", "141.22", "+2.06"],
        ["META", "734.11", "+0.39"],
    ]

    return (
        <div className="project-visual relative min-h-[340px] overflow-hidden bg-ink p-5 text-paper md:min-h-[520px] md:p-8">
            <div className="absolute inset-y-0 right-0 w-2/3 bg-[radial-gradient(circle_at_70%_40%,rgba(255,87,34,0.28),transparent_42%)]" />
            <div className="relative grid h-full content-between gap-10">
                <div className="flex items-start justify-between border-b border-paper/16 pb-5">
                    <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-paper/48">
                            Live tape
                        </p>
                        <p className="mt-2 text-4xl font-medium tracking-tight">
                            38ms
                        </p>
                    </div>
                    <div className="grid gap-1 text-right text-xs uppercase tracking-[0.16em] text-paper/52">
                        <span>STOMP</span>
                        <span>Derived state</span>
                    </div>
                </div>
                <div className="grid gap-3">
                    {rows.map(([symbol, price, delta]) => (
                        <div
                            key={symbol}
                            className="grid grid-cols-[0.7fr_1fr_0.7fr] border-b border-paper/12 pb-3 text-sm"
                        >
                            <span className="font-medium">{symbol}</span>
                            <span className="text-paper/62">{price}</span>
                            <span
                                className={
                                    delta.startsWith("+")
                                        ? "text-signal"
                                        : "text-paper/48"
                                }
                            >
                                {delta}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="h-24 border-l border-b border-paper/18">
                    <div className="market-line h-full w-full" />
                </div>
            </div>
        </div>
    )
}

function WaxlistPreview() {
    const records = ["Blue Note", "Island", "Impulse!", "ECM"]

    return (
        <div className="project-visual min-h-[340px] overflow-hidden bg-[#e4ded2] p-5 md:min-h-[520px] md:p-8">
            <div className="grid h-full gap-8 md:grid-cols-[0.8fr_1fr]">
                <div className="flex flex-col justify-between border-r border-ink/14 pr-6">
                    <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-ink/48">
                            Collection
                        </p>
                        <p className="mt-3 text-5xl font-medium tracking-tight text-ink">
                            126
                        </p>
                    </div>
                    <div className="grid gap-2 text-sm text-ink/66">
                        <span>Recently added</span>
                        <span>Filtered by jazz · 1970s</span>
                    </div>
                </div>
                <div className="grid content-center gap-3">
                    {records.map((record, index) => (
                        <div
                            key={record}
                            className="grid grid-cols-[3rem_1fr_auto] items-center gap-4 border-b border-ink/14 pb-3"
                        >
                            <div
                                className="aspect-square border border-ink/18"
                                style={{
                                    backgroundColor:
                                        index % 2 === 0 ? "#ff5722" : "#171714",
                                }}
                            />
                            <span className="text-lg tracking-tight text-ink">
                                {record}
                            </span>
                            <span className="text-xs uppercase tracking-[0.16em] text-ink/46">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
