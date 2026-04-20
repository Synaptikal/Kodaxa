import Link from 'next/link';
import FeedbackForm from '@/components/feedback/FeedbackForm';

export const metadata = {
  title: 'Feedback — Kodaxa Studios',
  description: 'Share feature requests, bug reports, or community feedback.',
};

export default function Page() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/" className="text-sm text-cyan-300 hover:underline">
          ← Home
        </Link>
      </div>

      <h1 className="text-2xl font-bold">Community Feedback & Requests</h1>
      <p className="text-sm text-slate-400 mt-2">Submit requests or report issues — we read everything.</p>

      <section className="mt-6">
        <FeedbackForm />
      </section>
    </main>
  );
}
