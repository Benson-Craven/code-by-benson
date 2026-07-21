import SiteHeader from "./components/navigation/SiteHeader"
import AnimatedLink from "./components/work/AnimatedLink"

export default function NotFound() {
    return (
        <>
            <SiteHeader />
            <main
                id="main-content"
                tabIndex={-1}
                className="flex min-h-svh items-center bg-paper px-4 pb-20 pt-28 text-ink sm:px-6 md:pt-36 lg:px-10"
            >
                <div className="mx-auto grid w-full max-w-[1500px] gap-8">
                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-signal-dark">
                        404 · Page not found
                    </p>
                    <h1 className="max-w-5xl text-[clamp(3.5rem,11vw,10rem)] font-medium leading-[0.86] tracking-[-0.06em]">
                        This page doesn’t exist.
                    </h1>
                    <p className="text-ink-secondary max-w-xl text-lg leading-relaxed md:text-xl">
                        The address may be wrong, or the page may have moved.
                    </p>
                    <div>
                        <AnimatedLink href="/">Return home</AnimatedLink>
                    </div>
                </div>
            </main>
        </>
    )
}
