import { NextRequest, NextResponse } from "next/server";

const MODELS = ["Midjourney", "DALL-E", "Stable Diffusion", "Flux", "Leonardo AI"] as const;

const SYSTEM_PROMPT = `You are an expert AI image prompt engineer. When the user gives you a rough prompt and a target model, rewrite it optimized for that specific model. Follow these rules per model: Midjourney: comma-separated keywords, include --ar 16:9, add --v 6.1, use cinematic/photorealistic style words. DALL-E 3: natural language description, very descriptive, mention art style and lighting. Stable Diffusion: comma-separated tags, include (masterpiece, best quality), use weight syntax (keyword:1.2), suggest negative prompts. Flux: natural flowing description, specific composition and style. Leonardo AI: clean tags with style presets. Return ONLY valid JSON with fields: optimizedPrompt (string), originalScore (number 0-100), optimizedScore (number 0-100), tips (array of 3 strings). No markdown, no code blocks, just raw JSON.`;

function stripCodeFences(text: string): string {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/, "");
  return cleaned.trim();
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    console.log("=== FIX-PROMPT REQUEST ===");
    console.log("API key exists:", !!apiKey);

    if (!apiKey) {
      console.error("OPENROUTER_API_KEY is not set in environment variables");
      return NextResponse.json(
        { error: "Server configuration error: API key is missing" },
        { status: 500 },
      );
    }

    const { prompt, model: targetModel } = await req.json();
    console.log("Input prompt:", prompt?.slice(0, 100));
    console.log("Target model:", targetModel);

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (!targetModel || !MODELS.includes(targetModel)) {
      return NextResponse.json({ error: "Invalid model selected" }, { status: 400 });
    }

    console.log("Calling OpenRouter API...");
    const start = Date.now();

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
          { role: "user", content: `Target model: ${targetModel}\nUser prompt: ${prompt.trim()}` },
        ],
      }),
    });

    const elapsed = Date.now() - start;
    console.log(`OpenRouter responded in ${elapsed}ms, status: ${response.status}`);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("OpenRouter error response:", errorBody);

      if (response.status === 401) {
        return NextResponse.json(
          { error: "Invalid API key. Check your OPENROUTER_API_KEY in .env.local." },
          { status: 500 },
        );
      }
      if (response.status === 429) {
        return NextResponse.json(
          { error: "Rate limited by OpenRouter. Please wait a moment and try again." },
          { status: 429 },
        );
      }
      return NextResponse.json(
        { error: `OpenRouter API error (${response.status}): ${errorBody}` },
        { status: 500 },
      );
    }

    const data = await response.json();

    if (!data.choices?.[0]?.message?.content) {
      console.error("Unexpected OpenRouter response structure:", JSON.stringify(data));
      return NextResponse.json(
        { error: "Received an empty response from the AI. Please try again." },
        { status: 500 },
      );
    }

    const responseText = data.choices[0].message.content;
    console.log("Raw response (first 500 chars):", responseText.slice(0, 500));

    const cleanedText = stripCodeFences(responseText);
    console.log("Cleaned text (first 500 chars):", cleanedText.slice(0, 500));

    let parsed: {
      optimizedPrompt: string;
      originalScore: number;
      optimizedScore: number;
      tips: string[];
    };

    try {
      parsed = JSON.parse(cleanedText);
    } catch {
      console.error("Failed to parse AI response:", responseText);
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      original: prompt.trim(),
      fixed: parsed.optimizedPrompt,
      originalScore: Math.min(100, Math.max(0, parsed.originalScore || 0)),
      fixedScore: Math.min(100, Math.max(0, parsed.optimizedScore || 0)),
      tips: parsed.tips || [],
      model: targetModel,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("=== FIX-PROMPT ERROR ===");
    console.error("Error message:", message);

    return NextResponse.json(
      { error: `Failed to process prompt: ${message}` },
      { status: 500 },
    );
  }
}
