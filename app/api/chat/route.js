export async function POST(request) {
try {
const body = await request.json();
const { mode, message, category, type, input } = body;

```
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  return Response.json(
    { error: "AI engine not configured. Add ANTHROPIC_API_KEY to environment variables." },
    { status: 500 }
  );
}

let systemPrompt, userMessage;

if (mode === "classify") {
  userMessage = `SUBMISSION TYPE: ${type}\nSUBMISSION: ${(input || "").slice(0, 3000)}`;
  systemPrompt = `You are the classification engine for "YouBeenClassed" — an authoritative, structured verdict system. You classify submissions with intelligence, precision, and weight.
```

Respond ONLY in this exact JSON format, no other text, no markdown fences:
{
“class”: “A” or “B” or “C” or “D”,
“class_label”: “One of: Scalable / Fixable / Hobby / Delusion”,
“subtitle”: “A sharp, memorable 3-8 word verdict tagline”,
“summary”: “2-3 sentences. Authoritative. Direct. No fluff. Explain why this earned its class.”,
“score”: number from 1 to 100,
“strength”: “1-2 sentences on the core strength”,
“weakness”: “1-2 sentences on the critical weakness”,
“final_quote”: “A single devastating or inspiring closing line. Like a judge’s final word.”
}`; } else { userMessage = message || ""; const categoryContext = category ? `The user selected the “${category}” category. Tailor your response to help with this area.`: ""; systemPrompt =`You are the AI assistant for YouBeenClassed — “The Human Leverage Engine.” You help everyday people gain real advantages through AI-powered guidance. You are NOT a corporate chatbot. You’re a sharp, resourceful friend who gives real talk and actionable advice.

${categoryContext}

Your personality:

- Talk like a smart friend, not a help desk
- Be direct, practical, and specific
- Give step-by-step actionable advice when relevant
- Use real examples and numbers when possible
- Don’t hedge everything — have opinions
- Keep responses focused and readable — use short paragraphs
- Match the energy of what they’re asking — casual for casual, serious for serious
- If someone’s idea is bad, tell them honestly but constructively
- Always end with a clear next step or follow-up question

Categories you help with:

- Make Money: Side hustles, business ideas, monetization, negotiation, income strategies
- Fix Something: Problem-solving, troubleshooting, life/tech/relationship fixes
- Learn Something: Skill acquisition, knowledge shortcuts, understanding complex topics
- Build Something: Creating projects, apps, brands, businesses from scratch
- Improve Myself: Habits, productivity, fitness, mindset, personal growth
- Save Me Time: Automation, efficiency, delegation, life hacks, shortcuts`;
  }
  
  const response = await fetch(“https://api.anthropic.com/v1/messages”, {
  method: “POST”,
  headers: {
  “Content-Type”: “application/json”,
  “x-api-key”: apiKey,
  “anthropic-version”: “2023-06-01”,
  },
  body: JSON.stringify({
  model: “claude-sonnet-4-20250514”,
  max_tokens: 1024,
  system: systemPrompt,
  messages: [{ role: “user”, content: userMessage }],
  }),
  });
  
  if (!response.ok) {
  const errText = await response.text();
  console.error(“Anthropic API error:”, errText);
  return Response.json({ error: “AI engine temporarily unavailable.” }, { status: 502 });
  }
  
  const data = await response.json();
  const text = data.content?.[0]?.text || “”;
  
  if (mode === “classify”) {
  try {
  const parsed = JSON.parse(text.replace(/`json|`/g, “”).trim());
  return Response.json(parsed);
  } catch {
  return Response.json({ error: “Classification failed to parse.” }, { status: 500 });
  }
  }
  
  return Response.json({ reply: text });
  } catch (err) {
  console.error(“API route error:”, err);
  return Response.json({ error: “Something went wrong.” }, { status: 500 });
  }
  }