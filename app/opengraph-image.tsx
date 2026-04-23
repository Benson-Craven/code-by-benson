import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Benson Craven — Front & Full-Stack Developer"
export const size = { width: 1200, height: 630 }

export default function OGImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    display: "flex",
                    background: "#0a0a0a",
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <h1 style={{ color: "white", fontSize: 64 }}>Benson Craven</h1>
            </div>
        ),
        {
            ...size,
        }
    )
}
