/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: "/redesign",
                destination: "/",
                permanent: true,
            },
            {
                source: "/redesign/projects/:slug",
                destination: "/projects/:slug",
                permanent: true,
            },
        ]
    },
}

export default nextConfig
