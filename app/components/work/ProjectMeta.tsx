type ProjectMetaProps = {
    label: string
    value: string
    tags: string[]
}

export default function ProjectMeta({ label, value, tags }: ProjectMetaProps) {
    return (
        <div className="grid gap-5 border-t border-ink/16 pt-5 sm:grid-cols-[0.7fr_1fr]">
            <div>
                <p className="mb-2 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-ink/48">
                    {label}
                </p>
                <p className="max-w-sm text-sm leading-relaxed text-ink/72">
                    {value}
                </p>
            </div>
            <div>
                <p className="mb-2 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-ink/48">
                    Stack
                </p>
                <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-ink/78">
                    {tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
