import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Air Fryer Intelligence";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "72px",
        background: "#173b2d",
        color: "#ffffff",
        fontFamily: "Arial",
      }}
    >
      <div style={{ fontSize: 28, letterSpacing: 5, fontWeight: 700 }}>AIR FRYER INTELLIGENCE</div>
      <div style={{ marginTop: 28, fontSize: 72, lineHeight: 1.05, fontWeight: 800 }}>
        Real products. Better comparisons.
      </div>
      <div style={{ marginTop: 28, fontSize: 30, color: "#d7e6dc" }}>
        Air fryer models, specs, brands and Amazon buying links.
      </div>
    </div>
  );
}
