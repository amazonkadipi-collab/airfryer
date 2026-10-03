import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Air Fryer Intelligence";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "72px",
        background: "#f7f3ea",
        color: "#173b2d",
        fontFamily: "Arial",
      }}
    >
      <div style={{ fontSize: 28, letterSpacing: 5, fontWeight: 700 }}>AIR FRYER INTELLIGENCE</div>
      <div style={{ marginTop: 28, fontSize: 72, lineHeight: 1.05, fontWeight: 800 }}>
        Search. Compare. Choose.
      </div>
      <div style={{ marginTop: 28, fontSize: 30, color: "#52655b" }}>
        Real air fryer models, specifications and Amazon links.
      </div>
    </div>
  );
}
