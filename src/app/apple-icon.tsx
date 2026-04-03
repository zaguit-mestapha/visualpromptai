import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #6C3CE1 0%, #00C9A7 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "40px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <span style={{ fontSize: "110px", fontWeight: 700, color: "white" }}>
          V
        </span>
      </div>
    ),
    { ...size }
  );
}
