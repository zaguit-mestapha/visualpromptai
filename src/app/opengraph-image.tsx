import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "VisualPromptAI - Visual AI Prompt Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #6C3CE1 0%, #00C9A7 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
              fontWeight: 700,
              color: "white",
            }}
          >
            V
          </div>
          <span style={{ fontSize: "48px", fontWeight: 700, color: "white" }}>
            VisualPromptAI
          </span>
        </div>
        <p
          style={{
            fontSize: "28px",
            color: "rgba(255,255,255,0.9)",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.4,
          }}
        >
          Build AI Image Prompts Visually
        </p>
        <p
          style={{
            fontSize: "18px",
            color: "rgba(255,255,255,0.7)",
            marginTop: "12px",
          }}
        >
          Midjourney &middot; DALL-E &middot; Stable Diffusion &middot; Flux
        </p>
      </div>
    ),
    { ...size }
  );
}
