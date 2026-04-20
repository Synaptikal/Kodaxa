import FeedbackForm from '@/components/feedback/FeedbackForm';

export const metadata = {
  title: 'Feedback — Kodaxa Studios',
  description: 'Share feature requests, bug reports, or community feedback.',
};

export default function Page() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Community Feedback & Requests</h1>
      <p className="text-sm text-slate-400 mt-2">Submit requests or report issues — we read everything.</p>

      <section className="mt-6">
        <FeedbackForm />
      </section>
    </main>
  );
}
