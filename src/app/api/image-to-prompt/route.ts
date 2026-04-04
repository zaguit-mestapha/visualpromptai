import { NextRequest } from "next/server";

const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB

const MODELS = [
  "Midjourney",
  "DALL-E 3",
  "Stable Diffusion",
  "Flux",
  "Leonardo AI",
  "Grok",
  "General",
] as const;

const STYLES = ["detailed", "concise", "creative"] as const;

function stripCodeFences(text: string): string {
  let cleaned = text.trim();
  cleaned = cleaned
    .replace(/^```(?:json)?\s*\n?/i, "")
    .replace(/\n?```\s*$/, "");
  return cleaned.trim();
}

function buildPrompt(model: string, style: string): string {
  return `Analyze this image in extreme detail. Generate an optimized AI image prompt that would recreate this image as closely as possible. Include: subject description, art style, lighting, camera angle, color palette, composition, mood, and technical parameters.
Target model: ${model}
Follow these model-specific formatting rules:
- Midjourney: Use comma-separated keywords. Add --ar [detect aspect ratio]. Add --v 6.1. Use style words like cinematic, photorealistic, hyperdetailed.
- DALL-E 3: Write as a natural language paragraph. Be very descriptive. Mention art style, lighting, and atmosphere explicitly.
- Stable Diffusion: Use comma-separated tags. Start with (masterpiece, best quality, highly detailed). Use weight syntax like (keyword:1.2) for emphasis. Also generate a negative prompt.
- Flux: Write as a flowing natural description. Focus on specific composition, style, and mood. Be precise about spatial relationships.
- Leonardo AI: Use clean comma-separated tags with style presets. Include resolution and quality tags.
- Grok: Write as a detailed natural language description similar to DALL-E format but more concise.
- General: Write a detailed universal prompt that works across models.

Prompt style: ${style}
Return ONLY valid JSON with these fields:
{
"prompt": "the optimized prompt text",
"negativePrompt": "negative prompt if applicable (Stable Diffusion), empty string otherwise",
"detectedSubject": "what the image shows in 1 sentence",
"detectedStyle": "the art style detected",
"detectedMood": "the mood/atmosphere",
"tags": ["array", "of", "relevant", "tags"],
"score": 85,
"tips": ["tip 1 for improving", "tip 2", "tip 3"]
}
No markdown, no code blocks, just raw JSON.`;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "Service temporarily unavailable" },
        { status: 503 }
      );
    }

    let body: { image?: string; model?: string; promptStyle?: string };
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { image, model, promptStyle } = body;

    if (!image || typeof image !== "string") {
      return Response.json(
        { error: "Image is required as a base64 string" },
        { status: 400 }
      );
    }

    // Check base64 size (~4MB)
    const sizeBytes = Math.ceil((image.length * 3) / 4);
    if (sizeBytes > MAX_IMAGE_SIZE) {
      return Response.json(
        { error: "Image must be under 4MB" },
        { status: 400 }
      );
    }

    const targetModel =
      MODELS.find((m) => m === model) || "General";
    const style =
      STYLES.find((s) => s === promptStyle) || "detailed";

    const systemPrompt = buildPrompt(targetModel, style);

    // Detect mime type from base64 header or default to jpeg
    let mimeType = "image/jpeg";
    if (image.startsWith("/9j/")) mimeType = "image/jpeg";
    else if (image.startsWith("iVBOR")) mimeType = "image/png";
    else if (image.startsWith("UklGR")) mimeType = "image/webp";

    const tryModel = async (modelId: string) => {
      const res = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://visualpromptai.com",
            "X-Title": "VisualPromptAI",
          },
          body: JSON.stringify({
            model: modelId,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "image_url",
                    image_url: {
                      url: `data:${mimeType};base64,${image}`,
                    },
                  },
                  {
                    type: "text",
                    text: systemPrompt,
                  },
                ],
              },
            ],
          }),
        }
      );
      if (!res.ok) {
        const errorBody = await res.text();
        console.error(`[image-to-prompt] ${modelId} failed (${res.status}):`, errorBody);
        throw new Error(`${res.status}: ${errorBody}`);
      }
      return res.json();
    };

    let data;
    try {
      data = await tryModel("google/gemma-3-27b-it:free");
    } catch (err) {
      console.error("[image-to-prompt] Primary model failed:", err);
      try {
        data = await tryModel("nvidia/nemotron-nano-2-vl:free");
      } catch (err2) {
        console.error("[image-to-prompt] Fallback model failed:", err2);
        return Response.json(
          {
            error:
              "Our AI is busy right now. Please try again in a moment.",
          },
          { status: 502 }
        );
      }
    }

    if (!data.choices?.[0]?.message?.content) {
      return Response.json(
        { error: "Received an empty response. Please try again." },
        { status: 502 }
      );
    }

    const responseText = data.choices[0].message.content;
    const cleanedText = stripCodeFences(responseText);

    let parsed: {
      prompt: string;
      negativePrompt: string;
      detectedSubject: string;
      detectedStyle: string;
      detectedMood: string;
      tags: string[];
      score: number;
      tips: string[];
    };

    try {
      parsed = JSON.parse(cleanedText);
    } catch {
      // Try to extract JSON from the response
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch {
          return Response.json(
            { error: "Failed to parse AI response. Please try again." },
            { status: 502 }
          );
        }
      } else {
        return Response.json(
          { error: "Failed to parse AI response. Please try again." },
          { status: 502 }
        );
      }
    }

    return Response.json({
      prompt: String(parsed.prompt || "").slice(0, 10000),
      negativePrompt: String(parsed.negativePrompt || "").slice(0, 5000),
      detectedSubject: String(parsed.detectedSubject || "").slice(0, 500),
      detectedStyle: String(parsed.detectedStyle || "").slice(0, 200),
      detectedMood: String(parsed.detectedMood || "").slice(0, 200),
      tags: Array.isArray(parsed.tags)
        ? parsed.tags.slice(0, 20).map((t) => String(t).slice(0, 100))
        : [],
      score: Math.min(100, Math.max(0, Number(parsed.score) || 75)),
      tips: Array.isArray(parsed.tips)
        ? parsed.tips.slice(0, 5).map((t) => String(t).slice(0, 500))
        : [],
      model: targetModel,
    });
  } catch (err) {
    console.error("Image-to-prompt error:", err);
    return Response.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
