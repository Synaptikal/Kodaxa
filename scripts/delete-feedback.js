/**
 * delete-feedback.js
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node scripts/delete-feedback.js <id>
 */
const { createClient } = require('@supabase/supabase-js');

async function main() {
  const id = process.argv[2];
  if (!id) {
    console.error('Usage: node scripts/delete-feedback.js <id>');
    process.exit(1);
  }

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    console.error('Set SUPABASE_URL and SUPABASE_SERVICE_KEY env vars');
    process.exit(1);
  }

  const supabase = require('@supabase/supabase-js').createClient(url, key);

  const { error } = await supabase.from('feedback').delete().eq('id', id);
  if (error) {
    console.error('Delete error', error);
    process.exit(1);
  }

  console.log('Deleted', id);
}

main();
