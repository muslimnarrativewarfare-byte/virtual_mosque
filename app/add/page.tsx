"use client";

import { FormEvent, useState } from "react";

type SubmissionState = {
  type: "idle" | "success" | "error";
  message: string;
};

export default function AddMosquePage() {
  const [state, setState] = useState<SubmissionState>({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setState({ type: "idle", message: "" });

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      city: String(form.get("city") ?? ""),
      country: String(form.get("country") ?? ""),
      address: String(form.get("address") ?? ""),
      description: String(form.get("description") ?? ""),
      services: String(form.get("services") ?? "")
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean),
      latitude: Number(form.get("latitude")),
      longitude: Number(form.get("longitude"))
    };

    try {
      const response = await fetch("/api/mosques", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        setState({ type: "error", message: data?.message ?? "We could not submit this mosque right now." });
        return;
      }

      event.currentTarget.reset();
      setState({ type: "success", message: "Mosque submitted successfully." });
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
          Version 1 keeps this simple: submit mosque details and coordinates to publish instantly.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Mosque name
            <input name="name" required minLength={2} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              City
              <input name="city" required minLength={2} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Country
              <input name="country" required minLength={2} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Address
            <input name="address" required minLength={4} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Latitude
              <input name="latitude" type="number" step="any" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Longitude
              <input name="longitude" type="number" step="any" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Services (comma-separated)
            <input name="services" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Description (optional)
            <textarea name="description" rows={4} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>

          <button type="submit" disabled={isSubmitting} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
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
