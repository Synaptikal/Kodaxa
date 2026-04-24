'use client';

import { useState } from 'react';

type Category = 'bug_report' | 'feature_request' | 'data_issue' | 'tool_feedback' | 'general';

const CATEGORIES: { value: Category; label: string; desc: string }[] = [
  { value: 'bug_report',      label: 'Bug Report',      desc: 'Something is broken or wrong' },
  { value: 'feature_request', label: 'Feature Request', desc: 'A tool or capability you want' },
  { value: 'data_issue',      label: 'Data Issue',      desc: 'Incorrect items, recipes, or skill data' },
  { value: 'tool_feedback',   label: 'Tool Feedback',   desc: 'Feedback on an existing tool' },
  { value: 'general',         label: 'General',         desc: 'Anything else' },
];

const PLACEHOLDERS: Record<Category, string> = {
  bug_report:      'Describe what happened and what you expected. Include which tool or page, steps to reproduce, and your browser if relevant.',
  feature_request: 'Describe the feature you want. What problem does it solve? How would it work?',
  data_issue:      'Which item, recipe, or skill has incorrect data? What is wrong and what should it be? Link a source if you have one.',
  tool_feedback:   'Which tool? What works well and what doesn\'t? Be as specific as possible.',
  general:         'Anything you want to share with the Kodaxa team.',
};

const MAX_MESSAGE = 2000;
const INPUT_CLS   = 'w-full bg-sr-bg border border-sr-border px-2 py-1.5 text-xs font-mono text-sr-text focus:border-accent/60 focus:outline-none placeholder:text-sr-subtle';

export default function FeedbackForm() {
  const [form, setForm] = useState({
    name:     '',
    email:    '',
    message:  '',
    category: 'general' as Category,
  });
  const [status, setStatus]   = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/feedback', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Submission failed');
      }
      setStatus('success');
      setForm({ name: '', email: '', message: '', category: 'general' });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Submission failed. Try again.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="border border-sr-border bg-sr-surface/40 p-8 text-center space-y-4">
        <p className="text-xl font-mono text-accent tracking-[0.1em]">◎ TRANSMISSION RECEIVED</p>
        <p className="text-sm text-sr-muted max-w-sm mx-auto leading-relaxed">
          Your feedback has been logged. The Kodaxa team reviews all submissions — thank you for contributing.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-[9px] font-mono uppercase tracking-[0.3em] text-sr-muted/60 hover:text-sr-muted transition-colors mt-2"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Report type */}
      <Section label="Report Type">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {CATEGORIES.map(cat => (
            <label
              key={cat.value}
              className={`flex items-start gap-2.5 p-3 border cursor-pointer transition-colors ${
                form.category === cat.value
                  ? 'border-accent/60 bg-accent/5 text-accent'
                  : 'border-sr-border hover:border-sr-border/70 text-sr-muted'
              }`}
            >
              <input
                type="radio"
                name="category"
                value={cat.value}
                checked={form.category === cat.value}
                onChange={() => set('category', cat.value)}
                className="mt-0.5 accent-amber-500"
              />
              <div>
                <p className="text-xs font-mono font-semibold">{cat.label}</p>
                <p className="text-[9px] text-sr-muted mt-0.5 leading-snug">{cat.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </Section>

      {/* Identity */}
      <Section label="Identity">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="In-Game Name" hint="optional">
            <input
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Your Stars Reach character name"
              className={INPUT_CLS}
            />
          </Field>
          <Field label="Email" hint="optional — for follow-up only">
            <input
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="you@example.com"
              className={INPUT_CLS}
            />
          </Field>
        </div>
      </Section>

      {/* Message */}
      <Section label="Message">
        <Field
          label="Detail *"
          hint={`${form.message.length} / ${MAX_MESSAGE}`}
        >
          <textarea
            required
            rows={6}
            maxLength={MAX_MESSAGE}
            value={form.message}
            onChange={e => set('message', e.target.value)}
            placeholder={PLACEHOLDERS[form.category]}
            className={`${INPUT_CLS} resize-none`}
          />
        </Field>
      </Section>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-1">
        <button
          type="submit"
          disabled={status === 'sending' || !form.message.trim()}
          className="px-5 py-2 text-xs font-mono uppercase tracking-[0.2em] border border-accent/60 text-accent hover:bg-accent/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {status === 'sending' ? '· Transmitting ·' : 'Transmit Feedback'}
        </button>
        {status === 'error' && (
          <p className="text-[10px] font-mono text-red-400">{errorMsg}</p>
        )}
      </div>
    </form>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-sr-muted/60 shrink-0">{label}</p>
        <div className="h-px flex-1 bg-sr-border" />
      </div>
      {children}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[8px] font-mono uppercase tracking-widest text-sr-muted/70">
        {label}
        {hint && <span className="text-sr-subtle normal-case tracking-normal ml-1">— {hint}</span>}
      </label>
      {children}
    </div>
  );
}
