import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "linear-gradient(135deg, #050505 0%, #0f0f0f 55%, #161616 100%)",
          border: "6px solid #00ff88",
          borderRadius: 36,
          color: "#f4f4f4",
          display: "flex",
          fontFamily: "Arial, sans-serif",
          fontSize: 88,
          fontWeight: 700,
          height: "100%",
          justifyContent: "center",
          letterSpacing: "-0.08em",
          width: "100%",
        }}
      >
        HI
      </div>
    ),
    size,
  );
}
