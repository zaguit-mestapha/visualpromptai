import { NextRequest } from "next/server";
import { apiGuard, errorResponse } from "@/lib/api-utils";
import { sanitizeString, validateEnum } from "@/lib/sanitize";

const MODELS = ["Midjourney", "DALL-E", "Stable Diffusion", "Flux", "Leonardo AI"] as const;

const SYSTEM_PROMPT = `You are an expert AI image prompt engineer. When the user gives you a rough prompt and a target model, rewrite it optimized for that specific model. Follow these rules per model: Midjourney: comma-separated keywords, include --ar 16:9, add --v 6.1, use cinematic/photorealistic style words. DALL-E 3: natural language description, very descriptive, mention art style and lighting. Stable Diffusion: comma-separated tags, include (masterpiece, best quality), use weight syntax (keyword:1.2), suggest negative prompts. Flux: natural flowing description, specific composition and style. Leonardo AI: clean tags with style presets. Return ONLY valid JSON with fields: optimizedPrompt (string), originalScore (number 0-100), optimizedScore (number 0-100), tips (array of 3 strings). No markdown, no code blocks, just raw JSON.`;

function stripCodeFences(text: string): string {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/, "");
  return cleaned.trim();
}

export async function POST(req: NextRequest) {
  // Security guards: rate limit, CSRF, content-type, body size
  const guard = apiGuard(req, "api");
  if (guard) return guard;

  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error("OPENROUTER_API_KEY is not set");
      return errorResponse("Service temporarily unavailable", 503);
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return errorResponse("Invalid JSON body", 400);
    }

    const { prompt: rawPrompt, model: rawModel } = body as Record<string, unknown>;

    // Input validation and sanitization
    const prompt = sanitizeString(rawPrompt, 5000);
    if (!prompt) {
      return errorResponse("Prompt is required and must be under 5000 characters", 400);
    }

    const targetModel = validateEnum(rawModel, MODELS);
    if (!targetModel) {
      return errorResponse("Invalid model. Allowed: " + MODELS.join(", "), 400);
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://visualpromptai.com",
        "X-Title": "VisualPromptAI",
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Target model: ${targetModel}\nUser prompt: ${prompt}` },
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("OpenRouter error:", response.status, errorBody);

      if (response.status === 429) {
        return errorResponse("Rate limited. Please wait a moment and try again.", 429);
      }
      return errorResponse("Failed to optimize prompt. Please try again.", 502);
    }

    const data = await response.json();

    if (!data.choices?.[0]?.message?.content) {
      console.error("Empty OpenRouter response");
      return errorResponse("Received an empty response. Please try again.", 502);
    }

    const responseText = data.choices[0].message.content;
    const cleanedText = stripCodeFences(responseText);

    let parsed: {
      optimizedPrompt: string;
      originalScore: number;
      optimizedScore: number;
      tips: string[];
    };

    try {
      parsed = JSON.parse(cleanedText);
    } catch {
      console.error("Failed to parse AI response:", responseText.slice(0, 500));
      return errorResponse("Failed to parse AI response. Please try again.", 502);
    }

    return Response.json({
      original: prompt,
      fixed: sanitizeString(parsed.optimizedPrompt, 10000) || prompt,
      originalScore: Math.min(100, Math.max(0, Number(parsed.originalScore) || 0)),
      fixedScore: Math.min(100, Math.max(0, Number(parsed.optimizedScore) || 0)),
      tips: Array.isArray(parsed.tips) ? parsed.tips.slice(0, 5).map((t) => String(t).slice(0, 500)) : [],
      model: targetModel,
    });
  } catch (err) {
    return errorResponse("An unexpected error occurred", 500, err);
  }
}
