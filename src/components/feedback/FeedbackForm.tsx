"use client";

import { useState } from "react";

type FormState = {
  name: string;
  email: string;
  message: string;
};

export default function FeedbackForm() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("failed");
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <div className="mb-3">
        <label className="block text-sm font-medium">Name</label>
        <input
          required
          className="mt-1 block w-full rounded border px-3 py-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          required
          className="mt-1 block w-full rounded border px-3 py-2"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium">Message / Request</label>
        <textarea
          required
          rows={6}
          className="mt-1 block w-full rounded border px-3 py-2"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 rounded bg-amber-600 text-white"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending…" : "Send feedback"}
        </button>

        {status === "success" && <p className="text-sm text-emerald-400">Thanks — submitted.</p>}
        {status === "error" && <p className="text-sm text-rose-400">Submission failed.</p>}
      </div>
    </form>
  );
}
