import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import sharp from "sharp"

export const runtime = "nodejs"
export const alt = "Benson Craven, Full-stack developer, with his frog mascot"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OGImage() {
    // ImageResponse needs a static weight of the site's variable font.
    const [font, frog] = await Promise.all([
        readFile(
            join(
                process.cwd(),
                "public/fonts/FunnelSans/FunnelSans-SemiBold.ttf",
            ),
        ),
        readFile(join(process.cwd(), "public/frog-mascot/frog-static.png")),
    ])

    // Keep the original pixel edges sharp at social-card size.
    const frogImage = await sharp(frog)
        .resize({ width: 400, kernel: "nearest" })
        .png()
        .toBuffer()

    return new ImageResponse(
        <div
            style={{
                display: "flex",
                background: "#FFFFFF",
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 64,
                color: "#0B0B0C",
                fontFamily: "Funnel Sans",
            }}
        >
            <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ color: "#3A5DE3", fontSize: 28 }}>
                    Full-stack developer
                </span>
                <h1
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        fontSize: 112,
                        fontWeight: 600,
                        lineHeight: 0.95,
                        letterSpacing: -5,
                        margin: "24px 0 0",
                    }}
                >
                    <span>Benson</span>
                    <span>Craven</span>
                </h1>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={`data:image/png;base64,${frogImage.toString("base64")}`}
                alt=""
                width={400}
                height={420}
                style={{ objectFit: "contain" }}
            />
        </div>,
        {
            ...size,
            fonts: [
                {
                    name: "Funnel Sans",
                    data: font,
                    style: "normal",
                    weight: 600,
                },
            ],
        },
    )
}
