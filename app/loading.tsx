export default function Loading() {
    return (
        <main
            id="main-content"
            className="flex min-h-svh items-center justify-center bg-paper px-4 text-ink"
            aria-busy="true"
        >
            <div
                role="status"
                aria-live="polite"
                className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.16em]"
            >
                <span
                    aria-hidden="true"
                    className="size-3 animate-pulse rounded-full bg-signal-dark"
                />
                <span>Loading page…</span>
            </div>
        </main>
    )
}
