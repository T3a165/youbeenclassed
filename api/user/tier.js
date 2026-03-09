import { PrismaClient } from '@prisma/client';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const prisma = new PrismaClient();

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const TIER_LIMITS = {
  FREE: 3,
  CASUAL: 20,
  PRO: 1000,
  TEAM: 10000,
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    // Get user from database
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // Create user if doesn't exist
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          clerkId: userId,
          email: 'temp@example.com', // Will be updated by webhook
          tier: 'FREE',
        },
      });
    }

    // Check daily reset
    const now = new Date();
    const lastReset = new Date(user.lastReset);
    const hoursSinceReset = (now - lastReset) / (1000 * 60 * 60);

    if (hoursSinceReset >= 24) {
      // Reset daily count
      await prisma.user.update({
        where: { id: userId },
        data: {
          dailyCount: 0,
          lastReset: now,
        },
      });
      user.dailyCount = 0;
    }

    const limit = TIER_LIMITS[user.tier] || TIER_LIMITS.FREE;
    const remaining = Math.max(0, limit - user.dailyCount);

    return res.status(200).json({
      tier: user.tier,
      limit,
      used: user.dailyCount,
      remaining,
      submissions: user.submissions,
    });

  } catch (error) {
    console.error('Get tier error:', error);
    return res.status(500).json({ error: error.message });
  }
}
