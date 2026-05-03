import { ImageResponse } from "next/og";

export const alt = "imberg.dev";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(0,255,136,0.22), transparent 32%), radial-gradient(circle at 80% 15%, rgba(255,255,255,0.08), transparent 28%), linear-gradient(135deg, #020202 0%, #0a0a0a 52%, #111111 100%)",
          color: "#f4f4f4",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "2px solid #00ff88",
            color: "#f4f4f4",
            display: "flex",
            fontFamily: "Arial, sans-serif",
            fontSize: 60,
            fontWeight: 700,
            height: 120,
            justifyContent: "center",
            letterSpacing: "-0.08em",
            width: 120,
          }}
        >
          <div style={{ alignSelf: "center" }}>HI</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              color: "#00ff88",
              fontFamily: "Arial, sans-serif",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            software • systems • business
          </div>
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: 86,
              fontWeight: 700,
              letterSpacing: "-0.06em",
              lineHeight: 1,
            }}
          >
            imberg.dev
          </div>
          <div
            style={{
              color: "#b7b7b7",
              fontFamily: "Arial, sans-serif",
              fontSize: 34,
              lineHeight: 1.3,
              maxWidth: 880,
            }}
          >
            Developer portfolio focused on practical software, systems thinking,
            and business-aware technical work.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
