import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Benson Craven — Frontend Engineer"
export const size = { width: 1200, height: 630 }

export default function OGImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    display: "flex",
                    background: "#F2EFE8",
                    width: "100%",
                    height: "100%",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    padding: 64,
                    color: "#171714",
                }}
            >
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ color: "#B92E12", fontSize: 24 }}>
                        FRONTEND ENGINEER
                    </span>
                    <h1
                        style={{
                            fontSize: 96,
                            lineHeight: 0.9,
                            letterSpacing: -5,
                            margin: "18px 0 0",
                        }}
                    >
                        Benson Craven
                    </h1>
                </div>
                <div
                    style={{
                        width: 220,
                        height: 220,
                        background:
                            "radial-gradient(circle at 70% 45%, #FF5722, #B92E12 42%, transparent 43%)",
                        opacity: 0.8,
                    }}
                />
            </div>
        ),
        {
            ...size,
        }
    )
}
