"use client";

import { FormEvent, useState } from "react";

type SubmissionState = {
  type: "idle" | "success" | "error";
  message: string;
};

type ApiErrorPayload = {
  message?: string;
  error?: {
    message?: string;
  };
};

export default function AddMosquePage() {
  const [state, setState] = useState<SubmissionState>({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setIsSubmitting(true);
    setState({ type: "idle", message: "" });

    const form = new FormData(formElement);
    const payload = {
      name: String(form.get("name") ?? ""),
      city: String(form.get("city") ?? ""),
      country: String(form.get("country") ?? ""),
      description: String(form.get("description") ?? ""),
    };

    try {
      const response = await fetch("/api/mosques", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "demo-user",
          "x-user-role": "USER",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as ApiErrorPayload | null;
        const message = data?.error?.message ?? data?.message ?? "We could not submit this mosque right now.";

        setState({
          type: "error",
          message,
        });
        return;
      }

      formElement.reset();
      setState({ type: "success", message: "Mosque submitted successfully for review." });
    } catch {
      setState({ type: "error", message: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-12 sm:px-10">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Add a mosque</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Share a mosque with the community directory. Submissions are reviewed before being published.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Mosque name
            <input
              name="name"
              required
              minLength={2}
              maxLength={120}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-0 focus:border-slate-500"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              City
              <input
                name="city"
                required
                minLength={2}
                maxLength={120}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-0 focus:border-slate-500"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Country
              <input
                name="country"
                required
                minLength={2}
                maxLength={120}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-0 focus:border-slate-500"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Description (optional)
            <textarea
              name="description"
              rows={5}
              maxLength={1500}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-0 focus:border-slate-500"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit mosque"}
          </button>
        </form>

        {state.type !== "idle" ? (
          <p className={`mt-4 text-sm ${state.type === "success" ? "text-emerald-700" : "text-red-700"}`}>{state.message}</p>
        ) : null}
      </section>
    </main>
  );
}
