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
          borderRadius: 14,
          color: "#f4f4f4",
          display: "flex",
          fontFamily: "Arial, sans-serif",
          fontSize: 40,
          fontWeight: 700,
          height: "100%",
          justifyContent: "center",
          letterSpacing: "0.02em",
          lineHeight: 1,
          paddingBottom: 1,
          width: "100%",
        }}
      >
        HI
      </div>
    ),
    size,
  );
}
