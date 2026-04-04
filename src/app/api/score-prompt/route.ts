import { NextRequest } from "next/server";
import { apiGuard, errorResponse } from "@/lib/api-utils";
import { sanitizeString, validateEnum } from "@/lib/sanitize";

const MODELS = [
  "Midjourney",
  "DALL-E 3",
  "Stable Diffusion",
  "Flux",
  "Leonardo AI",
  "Grok",
  "General",
] as const;

const SYSTEM_PROMPT = `You are an expert AI image prompt analyst. Score the given prompt for the target AI model on these 6 criteria, each scored 0-100:

Clarity - How clear and unambiguous is the subject description?
Specificity - How detailed are the style, lighting, composition instructions?
Technical - Are model-specific parameters correct? (--ar, --v for Midjourney, weights for SD, etc.)
Creativity - How unique and imaginative is the prompt concept?
Structure - Is the prompt well-organized and properly formatted for the target model?
Effectiveness - How likely is this prompt to produce a high-quality result?

Also provide:

An overall score (weighted average: Clarity 20%, Specificity 25%, Technical 15%, Creativity 15%, Structure 10%, Effectiveness 15%)
3 specific actionable tips to improve the prompt
A brief 1-sentence verdict summarizing the prompt quality
The top 3 strengths of the prompt
The top 3 weaknesses of the prompt

Target model: [SELECTED_MODEL]
Return ONLY valid JSON:
{
"overallScore": 72,
"scores": {
"clarity": 80,
"specificity": 65,
"technical": 70,
"creativity": 85,
"structure": 60,
"effectiveness": 72
},
"verdict": "A solid prompt with good creative vision but lacking model-specific technical parameters.",
"strengths": ["Strong subject description", "Good mood/atmosphere keywords", "Creative concept"],
"weaknesses": ["Missing aspect ratio parameter", "No lighting specification", "Could use more style keywords"],
"tips": [
"Add --ar 16:9 --v 6.1 for Midjourney to control aspect ratio and version",
"Include lighting keywords like 'golden hour, dramatic lighting, rim light' to improve visual quality",
"Add composition terms like 'rule of thirds, centered subject, depth of field' for better framing"
]
}
No markdown, no code blocks, just raw JSON.`;

function stripCodeFences(text: string): string {
  let cleaned = text.trim();
  cleaned = cleaned
    .replace(/^```(?:json)?\s*\n?/i, "")
    .replace(/\n?```\s*$/, "");
  return cleaned.trim();
}

export async function POST(req: NextRequest) {
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

    const { prompt: rawPrompt, model: rawModel } = body as Record<
      string,
      unknown
    >;

    const prompt = sanitizeString(rawPrompt, 2000);
    if (!prompt) {
      return errorResponse(
        "Prompt is required and must be under 2000 characters",
        400
      );
    }

    const targetModel = validateEnum(rawModel, MODELS);
    if (!targetModel) {
      return errorResponse(
        "Invalid model. Allowed: " + MODELS.join(", "),
        400
      );
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + apiKey,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://visualpromptai.com",
          "X-Title": "VisualPromptAI",
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT.replace("[SELECTED_MODEL]", targetModel),
            },
            {
              role: "user",
              content: `Target model: ${targetModel}\nPrompt to score: ${prompt}`,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("OpenRouter error:", response.status, errorBody);

      if (response.status === 429) {
        return errorResponse(
          "Rate limited. Please wait a moment and try again.",
          429
        );
      }
      return errorResponse(
        "Our AI is busy right now. Please try again in a moment.",
        502
      );
    }

    const data = await response.json();

    if (!data.choices?.[0]?.message?.content) {
      console.error("Empty OpenRouter response");
      return errorResponse(
        "Received an empty response. Please try again.",
        502
      );
    }

    const responseText = data.choices[0].message.content;
    const cleanedText = stripCodeFences(responseText);

    let parsed: {
      overallScore: number;
      scores: {
        clarity: number;
        specificity: number;
        technical: number;
        creativity: number;
        structure: number;
        effectiveness: number;
      };
      verdict: string;
      strengths: string[];
      weaknesses: string[];
      tips: string[];
    };

    try {
      parsed = JSON.parse(cleanedText);
    } catch {
      console.error(
        "Failed to parse AI response:",
        responseText.slice(0, 500)
      );
      return errorResponse(
        "Failed to parse AI response. Please try again.",
        502
      );
    }

    const clamp = (n: unknown) =>
      Math.min(100, Math.max(0, Number(n) || 0));

    return Response.json({
      overallScore: clamp(parsed.overallScore),
      scores: {
        clarity: clamp(parsed.scores?.clarity),
        specificity: clamp(parsed.scores?.specificity),
        technical: clamp(parsed.scores?.technical),
        creativity: clamp(parsed.scores?.creativity),
        structure: clamp(parsed.scores?.structure),
        effectiveness: clamp(parsed.scores?.effectiveness),
      },
      verdict: String(parsed.verdict || "").slice(0, 500),
      strengths: Array.isArray(parsed.strengths)
        ? parsed.strengths.slice(0, 3).map((s) => String(s).slice(0, 300))
        : [],
      weaknesses: Array.isArray(parsed.weaknesses)
        ? parsed.weaknesses.slice(0, 3).map((w) => String(w).slice(0, 300))
        : [],
      tips: Array.isArray(parsed.tips)
        ? parsed.tips.slice(0, 3).map((t) => String(t).slice(0, 500))
        : [],
    });
  } catch (err) {
    return errorResponse("An unexpected error occurred", 500, err);
  }
}
