import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PLANS = {
  FREE: {
    name: "Free",
    dailyLimit: 5,
    maxTokens: 800,
    features: ["basic", "short_verdict"],
    maxTextLength: 500,
  },
  CASUAL: {
    name: "Casual",
    dailyLimit: 50,
    maxTokens: 1200,
    features: ["basic", "full_verdict", "strengths_weaknesses"],
    maxTextLength: 2000,
  },
  PRO: {
    name: "Pro",
    dailyLimit: 200,
    maxTokens: 2000,
    features: ["basic", "full_verdict", "strengths_weaknesses", "detailed_analysis", "priority_processing"],
    maxTextLength: 5000,
  },
  TEAM: {
    name: "Team",
    dailyLimit: 1000,
    maxTokens: 4000,
    features: ["basic", "full_verdict", "strengths_weaknesses", "detailed_analysis", "priority_processing", "team_analytics"],
    maxTextLength: 10000,
  },
} as const;

type PlanType = keyof typeof PLANS;

const SCORE_TO_RANK = {
  S: { min: 95, max: 100, label: "S-Tier", color: "#FFD700" },
  A: { min: 85, max: 94, label: "A-Tier", color: "#C0C0C0" },
  B: { min: 70, max: 84, label: "B-Tier", color: "#CD7F32" },
  C: { min: 55, max: 69, label: "C-Tier", color: "#4A90E2" },
  D: { min: 40, max: 54, label: "D-Tier", color: "#7B68EE" },
  E: { min: 25, max: 39, label: "E-Tier", color: "#FF6B6B" },
  F: { min: 0, max: 24, label: "F-Tier", color: "#2C2C2C" },
} as const;

const BasicVerdictSchema = z.object({
  score: z.number().int().min(0).max(100),
  verdict_statement: z.string().max(200),
});

const FullVerdictSchema = z.object({
  score: z.number().int().min(0).max(100),
  verdict_statement: z.string(),
  strengths: z.array(z.string()).min(1).max(3),
  weaknesses: z.array(z.string()).min(1).max(3),
  context_analysis: z.string().optional(),
});

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(userId: string, plan: PlanType) {
  const now = Date.now();
  const planConfig = PLANS[plan];
  const windowMs = 24 * 60 * 60 * 1000;
  
  const userLimit = rateLimitMap.get(userId);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: planConfig.dailyLimit - 1 };
  }
  
  if (userLimit.count >= planConfig.dailyLimit) {
    return { allowed: false, remaining: 0 };
  }
  
  userLimit.count++;
  return { allowed: true, remaining: planConfig.dailyLimit - userLimit.count };
}

async function moderateContent(text: string) {
  try {
    const moderation = await openai.moderations.create({
      model: "omni-moderation-latest",
      input: text,
    });
    
    const result = moderation.results[0];
    const flaggedCategories = Object.entries(result.categories)
      .filter(([_, flagged]) => flagged)
      .map(([category]) => category);
    
    return {
      flagged: result.flagged,
      categories: flaggedCategories,
    };
  } catch (error) {
    console.error("Moderation error:", error);
    return { flagged: false, categories: [] };
  }
}

async function getUserPlan(userId: string): Promise<PlanType> {
  try {
    const { user } = await import("@clerk/nextjs/server");
    const userData = await user.getUser(userId);
    
    const plan = userData.privateMetadata?.plan as PlanType | undefined;
    
    if (!plan && userData.publicMetadata?.plan) {
      return userData.publicMetadata.plan as PlanType;
    }
    
    return plan || "FREE";
  } catch (error) {
    console.error("Error fetching user plan:", error);
    return "FREE";
  }
}

function calculateRank(score: number) {
  for (const [rank, config] of Object.entries(SCORE_TO_RANK)) {
    if (score >= config.min && score <= config.max) {
      return { rank, label: config.label, color: config.color };
    }
  }
  return { rank: "F", label: "F-Tier", color: SCORE_TO_RANK.F.color };
}

function buildPrompt(text: string, category: string, tone: string, plan: PlanType) {
  const planConfig = PLANS[plan];
  const isPaid = plan !== "FREE";
  
  const basePrompt = `You are "The Judge" - an AI that delivers brutally honest, entertaining verdicts on user-submitted content.

Category: ${category}
Tone: ${tone} (be witty but fair)
Text to analyze: "${text}"

${isPaid ? `Provide a comprehensive analysis including:
1. A numerical score (0-100) based on objective criteria for ${category}
2. 2-3 specific strengths (what works well)
3. 2-3 specific weaknesses (what needs improvement)  
4. A final verdict statement (2-3 sentences max)
5. Brief context analysis (optional)` : `Provide a quick verdict:
1. A numerical score (0-100)
2. A one-sentence ruling (max 150 characters)`}

Scoring criteria for ${category}:
- S-Tier (95-100): Exceptional, near-perfect
- A-Tier (85-94): Excellent with minor flaws
- B-Tier (70-84): Good but noticeable issues
- C-Tier (55-69): Average, room for improvement
- D-Tier (40-54): Below average, significant issues
- E-Tier (25-39): Poor quality
- F-Tier (0-24): Failed/Unacceptable

Be honest but constructive. Use humor where appropriate for the tone.`;

  return basePrompt;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized", code: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { text, category, tone } = body;

    if (!text || !category || !tone) {
      return NextResponse.json(
        { error: "Missing required fields: text, category, tone", code: "INVALID_INPUT" },
        { status: 400 }
      );
    }

    const userPlan = await getUserPlan(userId);
    const planConfig = PLANS[userPlan];
    
    if (text.length > planConfig.maxTextLength) {
      return NextResponse.json(
        { 
          error: `Text exceeds ${userPlan} plan limit (${planConfig.maxTextLength} chars)`, 
          code: "LENGTH_EXCEEDED",
          upgradeUrl: "/upgrade" 
        },
        { status: 413 }
      );
    }

    const rateLimit = checkRateLimit(userId, userPlan);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: "Daily limit reached", 
          code: "RATE_LIMIT_EXCEEDED",
          plan: userPlan,
          limit: planConfig.dailyLimit,
          upgradeUrl: "/upgrade"
        },
        { status: 429 }
      );
    }

    const moderation = await moderateContent(text);
    if (moderation.flagged) {
      return NextResponse.json(
        { 
          error: "Content flagged for moderation", 
          code: "CONTENT_VIOLATION",
          categories: moderation.categories 
        },
        { status: 400 }
      );
    }

    const prompt = buildPrompt(text, category, tone, userPlan);
    const isFullVerdict = planConfig.features.includes("full_verdict");
    const schema = isFullVerdict ? FullVerdictSchema : BasicVerdictSchema;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a precise content evaluator. Always return valid JSON matching the specified schema exactly.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: zodResponseFormat(schema, "verdict"),
      max_tokens: planConfig.maxTokens,
      temperature: 0.7,
    });

    const message = completion.choices[0].message;
    if (message.refusal) {
      return NextResponse.json(
        { error: "AI refused to process content", code: "AI_REFUSAL" },
        { status: 400 }
      );
    }

    const parsedContent = JSON.parse(message.content || "{}");
    const rankInfo = calculateRank(parsedContent.score);
    
    const response = {
      verdict: {
        score: parsedContent.score,
        rank: rankInfo.rank,
        rankLabel: rankInfo.label,
        rankColor: rankInfo.color,
        statement: parsedContent.verdict_statement,
        ...(isFullVerdict && {
          strengths: parsedContent.strengths || [],
          weaknesses: parsedContent.weaknesses || [],
          contextAnalysis: parsedContent.context_analysis,
        }),
      },
      meta: {
        plan: userPlan,
        remainingToday: rateLimit.remaining,
        category,
        tone,
      },
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Verdict API error:", error);
    
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: "AI service temporarily unavailable", code: "AI_ERROR" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
