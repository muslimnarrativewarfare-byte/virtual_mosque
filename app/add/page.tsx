"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";

const DynamicLocationPicker = dynamic(() => import("./location-picker"), {
  ssr: false,
  loading: () => <p className="text-sm text-slate-500">Loading map picker…</p>
});

type SubmissionState = {
  type: "idle" | "success" | "error";
  message: string;
};

const DEFAULT_LAT = 24.8607;
const DEFAULT_LNG = 67.0011;

export default function AddMosquePage() {
  const [state, setState] = useState<SubmissionState>({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [latitude, setLatitude] = useState<string>(String(DEFAULT_LAT));
  const [longitude, setLongitude] = useState<string>(String(DEFAULT_LNG));
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const parsedLatitude = useMemo(() => Number(latitude), [latitude]);
  const parsedLongitude = useMemo(() => Number(longitude), [longitude]);

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setImageDataUrl("");
      setImagePreview("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setState({ type: "error", message: "Please upload a valid image file." });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setImageDataUrl(result);
      setImagePreview(result);
      setState({ type: "idle", message: "" });
    };
    reader.onerror = () => setState({ type: "error", message: "Could not read image file." });
    reader.readAsDataURL(file);
  }

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
      longitude: Number(form.get("longitude")),
      imageDataUrl
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
      setLatitude(String(DEFAULT_LAT));
      setLongitude(String(DEFAULT_LNG));
      setImageDataUrl("");
      setImagePreview("");
      setState({ type: "success", message: "Mosque submitted successfully." });
    } catch {
      setState({ type: "error", message: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  function selectFromMap(lat: number, lng: number) {
    setLatitude(String(lat));
    setLongitude(String(lng));
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setState({ type: "error", message: "Geolocation is not supported by this browser." });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(String(Number(position.coords.latitude.toFixed(6))));
        setLongitude(String(Number(position.coords.longitude.toFixed(6))));
        setState({ type: "idle", message: "" });
      },
      () => setState({ type: "error", message: "Unable to access your location." })
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-12 sm:px-10">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Add a mosque</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Create a complete listing with map location and image.</p>

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

          <label className="block text-sm font-medium text-slate-700">
            Mosque image (optional)
            <input name="image" type="file" accept="image/*" onChange={handleImageUpload} className="mt-1 block w-full text-sm" />
          </label>

          {imagePreview ? (
            <Image src={imagePreview} alt="Mosque preview" width={1200} height={480} unoptimized className="h-48 w-full rounded-lg border border-slate-200 object-cover" />
          ) : null}

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-slate-700">Pick location from map</p>
              <button
                type="button"
                onClick={useCurrentLocation}
                className="rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
              >
                Use my current location
              </button>
            </div>
            <DynamicLocationPicker latitude={parsedLatitude} longitude={parsedLongitude} onSelect={selectFromMap} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Latitude
              <input
                name="latitude"
                type="number"
                step="any"
                required
                value={latitude}
                onChange={(event) => setLatitude(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Longitude
              <input
                name="longitude"
                type="number"
                step="any"
                required
                value={longitude}
                onChange={(event) => setLongitude(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
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
