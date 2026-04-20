# Feedback feature

This document describes the feedback feature, database schema, deployment notes, and admin usage.

Table schema (Supabase SQL)

```sql
create table feedback (
  id uuid default uuid_generate_v4() primary key,
  name text,
  email text,
  message text,
  status text default 'pending', -- 'pending' | 'reviewed'
  created_at timestamptz default now()
);
```

Notes
- The API route `src/app/api/feedback/route.ts` handles `POST` to insert submissions, `GET` to list all items (server-side), and `DELETE` to remove by `id`.
- The public feedback page is at `/feedback` and uses a client form component at `src/components/feedback/FeedbackForm.tsx`.
- The admin list is at `/admin/feedback` and requires director-level access; it reads server-side via `createClient()` which uses cookies for auth.

Terminal deletion
- You can delete individual items from the terminal using `scripts/delete-feedback.js`. Example:

```bash
SUPABASE_URL=https://your-project.supabase.co SUPABASE_SERVICE_KEY=your_service_role_key node scripts/delete-feedback.js <id>
```

Security
- For terminal deletes you must use the Supabase service role key; keep it secret (do not commit it).
- Consider implementing RLS policies on the `feedback` table to restrict read/delete to authenticated director accounts when using the web admin.
 - Recommended: add RLS policies to allow selects/updates/deletes only to director-role users when accessed via the web admin. Terminal/script access should use the service role key.
