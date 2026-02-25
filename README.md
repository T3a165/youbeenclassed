# YouBeenClassed - One-Tap iPhone Deployment

## Steps to Deploy:

1. Upload this repo to GitHub from your iPhone.
2. Open Vercel iOS app → New Project → Import GitHub repo.
3. When prompted, fill environment variables:
   - OPENAI_API_KEY
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
4. Deploy. The site is live.
5. Supabase: Run SQL to create `submissions` table:

```sql
create table submissions (
  id uuid primary key default uuid_generate_v4(),
  email text,
  submission text not null,
  verdict text not null,
  created_at timestamp default now()
);
```

6. Test: Submit a sample idea → verdict generated → stored in Supabase.
