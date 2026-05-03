import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "linear-gradient(135deg, #050505 0%, #0f0f0f 55%, #161616 100%)",
          border: "2px solid #00ff88",
          color: "#f4f4f4",
          display: "flex",
          fontFamily: "Arial, sans-serif",
          fontSize: 30,
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
