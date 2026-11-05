export default function FrogFood() {
    return (
        <div className="preview-frog-food pointer-events-none absolute inset-0 max-lg:hidden">
            <svg
                data-frog-food="burger"
                className="absolute left-[18%] top-[57%] h-auto w-[20%] origin-center opacity-0"
                viewBox="0 0 24 24"
                focusable="false"
                shapeRendering="crispEdges"
            >
                <path fill="#38251e" d="M6 3h12v2h3v4h2v12H1V9h2V5h3Z" />
                <path fill="#efa548" d="M6 5h12v2h3v3H3V7h3ZM3 18h18v3H3Z" />
                <path fill="#fff0be" d="M7 6h2v1H7Zm7 1h2v1h-2Z" />
                <path fill="#83b85c" d="M2 10h20v2h-4v1h-4v-1H8v1H4v-1H2Z" />
                <path fill="#e26950" d="M3 13h18v2H3Z" />
                <path fill="#ffcf55" d="M3 15h18v1h-6v2h-3v-2H3Z" />
            </svg>
            <svg
                data-frog-food="shake"
                className="absolute left-[42%] top-[62%] h-auto w-[17%] origin-center opacity-0"
                viewBox="0 0 24 28"
                focusable="false"
                shapeRendering="crispEdges"
            >
                <path
                    fill="#38251e"
                    d="M14 0h7v3h-4v4h2v3h3v4h-2v12H6V14H4v-4h3V7h7Z"
                />
                <path fill="#ef718f" d="M15 1h5v1h-4v8h-1Z" />
                <path fill="#fff0d5" d="M10 6h4v2h3v3H7V9h3ZM6 11h14v2H6Z" />
                <path fill="#f5a9bc" d="M7 14h12v6h-1v5H8v-5H7Z" />
                <path fill="#fff0d5" d="M9 15h2v8H9Zm5 0h2v8h-2Z" />
                <path fill="#e65a70" d="M10 4h3v3h-3Z" />
            </svg>
            <svg
                data-frog-food="sushi"
                className="absolute left-[64%] top-[56%] h-auto w-[20%] origin-center opacity-0"
                viewBox="0 0 26 24"
                focusable="false"
                shapeRendering="crispEdges"
            >
                <path fill="#253c32" d="M4 3h18v2h3v15h-3v2H4v-2H1V5h3Z" />
                <path fill="#fff0d5" d="M5 5h16v2h2v7h-2v2H5v-2H3V7h2Z" />
                <path fill="#ee875f" d="M8 7h10v2h2v3h-2v2H8v-2H6V9h2Z" />
                <path fill="#86b45b" d="M8 9h4v3H8Z" />
                <path fill="#ffd889" d="M14 9h4v3h-4Z" />
                <path fill="#52715a" d="M4 17h2v3H4Zm16 0h2v3h-2Z" />
            </svg>
        </div>
    )
}
