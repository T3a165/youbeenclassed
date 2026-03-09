# YouBeenClassed

The internet's AI judgment engine. Submit ideas, receive structured verdicts.

## Features

- **AI Verdict Engine**: GPT-4 powered analysis with scores, ranks, strengths, and weaknesses
- **10 Categories**: Ideas, Business, Startups, Stories, Arguments, and more
- **3 Tone Modes**: Professional, Brutal Honesty, Roast
- **Payment Tiers**: Free (3/day), Casual ($4.99/mo), Pro ($14.99/mo), Team ($49/mo)
- **Social Features**: Share cards, public feed, leaderboards, appeals
- **Marketing Automation**: Auto-posting to Twitter/X, video ad generation

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Auth**: Clerk
- **Payments**: Stripe
- **Database**: PostgreSQL + Prisma
- **AI**: OpenAI GPT-4
- **Cache/Rate Limit**: Upstash Redis
- **Hosting**: Vercel

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your API keys

# Generate Prisma client
npm run db:generate

# Run dev server
npm run dev
```

## Deployment

### 1. Vercel Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 2. Environment Variables

Set these in Vercel dashboard:

- `DATABASE_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API key
- `CLERK_SECRET_KEY` & `VITE_CLERK_PUBLISHABLE_KEY` - Clerk credentials
- `STRIPE_SECRET_KEY` & `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe credentials
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis

### 3. Database

```bash
# Push schema to database
npm run db:push

# Open Prisma Studio
npm run db:studio
```

### 4. Stripe Setup

1. Create products in Stripe Dashboard:
   - Casual: $4.99/month
   - Pro: $14.99/month
   - Team: $49/month

2. Copy price IDs to environment variables

3. Set up webhook endpoint: `/api/stripe/webhook`

### 5. Clerk Setup

1. Create application in Clerk Dashboard
2. Configure OAuth providers (optional)
3. Set up webhook endpoint: `/api/webhooks/clerk`

## Marketing Automation

### Auto-Post to Social Media

```bash
# Run once
npm run marketing:post

# Run on schedule (every 60 min)
node scripts/marketing/scheduler.js --interval=60
```

### Generate Video Ads

```bash
# Generate for TikTok and Reels
npm run video:generate

# Generate specific platforms
node scripts/video-gen/generate-ads.js tiktok reels --count=5
```

## API Routes

- `POST /api/verdict` - Generate AI verdict
- `GET /api/user/tier` - Get user tier and limits
- `POST /api/stripe/create-checkout` - Create Stripe checkout
- `POST /api/stripe/webhook` - Stripe webhook handler
- `POST /api/webhooks/clerk` - Clerk webhook handler

## License

MIT
