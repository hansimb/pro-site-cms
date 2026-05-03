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
          borderRadius: 36,
          color: "#f4f4f4",
          display: "flex",
          fontFamily: "Arial, sans-serif",
          fontSize: 108,
          fontWeight: 700,
          height: "100%",
          justifyContent: "center",
          letterSpacing: "0.02em",
          lineHeight: 1,
          paddingBottom: 4,
          width: "100%",
        }}
      >
        HI
      </div>
    ),
    size,
  );
}
