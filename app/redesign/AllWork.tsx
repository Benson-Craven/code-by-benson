import Link from "next/link"
import { allWorkProjects, allWorkCountLabel } from "./allWorkData"
import PixelReveal from "./PixelReveal"
import styles from "./redesign.module.css"

export default function AllWork() {
    return (
        <section
            id="work"
            className={styles.work}
            data-project-index
            aria-labelledby="work-title"
        >
            <div className={styles.workHeader}>
                <h2 id="work-title">All work</h2>
                <p>{allWorkCountLabel()}</p>
            </div>
            <ul className={styles.workGrid}>
                {allWorkProjects.map((project) => (
                    <li
                        key={project.slug}
                        className={styles.workItem}
                        data-work-layout={project.layout}
                    >
                        <Link
                            href={project.href}
                            className={styles.workCard}
                            data-work-card
                            data-project-link
                            data-project-direction="open"
                            data-project-slug={project.slug}
                            data-project-tint={project.tint}
                        >
                            <figure
                                className={styles.workCover}
                                data-project-cover={project.slug}
                                data-tint={project.tint}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
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
                                />
                            </figure>
                            <span className={styles.workMeta}>
                                <span className={styles.workTitle}>
                                    {project.title}
                                </span>
                                <span className={styles.workTime}>
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
