import Link from "next/link"
import { allWorkProjects, allWorkCountLabel } from "./allWorkData"
import PixelReveal from "./PixelReveal"

export default function AllWork() {
    return (
        <section
            id="work"
            className="preview-work relative bg-[#e6e6e0] px-[max(4.72vw,24px)] pb-[clamp(120px,22vw,240px)] pt-[clamp(96px,16vw,180px)] text-preview-black grid-paper [--grid-line:#0b0b0c12]"
            data-project-index
            aria-labelledby="work-title"
        >
            <div className="grid grid-cols-4 items-end gap-4 md:grid-cols-12">
                <h2
                    id="work-title"
                    className="col-span-3 text-[clamp(42px,12vw,92px)] font-semibold leading-[0.85] tracking-[-0.05em] md:col-span-8 md:text-[clamp(64px,7vw,150px)]"
                >
                    All work
                </h2>
                <p className="col-span-1 justify-self-end whitespace-nowrap text-xs leading-[1.5] tracking-[-0.02em] opacity-55 md:col-span-4 md:text-[clamp(13px,1.1vw,16px)]">
                    {allWorkCountLabel()}
                </p>
            </div>
            <ul className="mt-[clamp(36px,6vw,72px)] grid list-none grid-cols-4 gap-x-3 gap-y-10 p-0 md:grid-cols-12 md:gap-x-6 md:gap-y-16">
                {allWorkProjects.map((project) => (
                    <li
                        key={project.slug}
                        className="min-w-0 data-[work-layout=half]:col-span-2 data-[work-layout=wide]:col-span-4 md:data-[work-layout=half]:col-span-4 md:data-[work-layout=wide]:col-span-4"
                        data-work-layout={project.layout}
                    >
                        <Link
                            href={project.href}
                            className="preview-work-card group/card block text-inherit no-underline hover:no-underline focus-visible:no-underline"
                            data-work-card
                            data-project-link
                            data-project-direction="open"
                            data-project-slug={project.slug}
                            data-project-tint={project.tint}
                        >
                            <figure
                                className="preview-work-cover group/cover relative m-0 aspect-[3/2] overflow-hidden rounded-[10px] bg-preview-black transition-[opacity,transform] duration-[250ms] ease-out"
                                data-project-cover={project.slug}
                                data-tint={project.tint}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    className="block h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-[1.04] group-focus-visible/card:scale-[1.04]"
                                    src={project.cover.src}
                                    alt={project.cover.alt}
                                    width={project.cover.width}
                                    height={project.cover.height}
                                    loading="lazy"
                                    decoding="async"
                                />
                                <PixelReveal
                                    src={project.cover.src}
                                    tint={project.tint}
                                    className="transition-[opacity,transform] duration-[250ms] ease-out group-hover/card:scale-[1.04] group-focus-visible/card:scale-[1.04]"
                                />
                            </figure>
                            <span className="mt-3 flex flex-wrap items-baseline justify-between gap-x-2.5 gap-y-0.5 max-lg:grid max-lg:gap-1">
                                <span className="min-w-0 text-[clamp(17px,1.4vw,22px)] font-semibold tracking-[-0.02em] md:text-[clamp(20px,1.6vw,26px)]">
                                    {project.title}
                                </span>
                                <span className="ml-auto text-[clamp(12px,1.1vw,15px)] opacity-55 max-lg:ml-0">
                                    {project.timeframe}
                                </span>
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    )
}
