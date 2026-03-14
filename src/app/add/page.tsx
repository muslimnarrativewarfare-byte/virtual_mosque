"use client";

import { FormEvent, useState } from "react";
import { LabeledInput, LabeledTextarea } from "@/components/FormControls";

export default function AddMosquePage() {
  const [status, setStatus] = useState<string>("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name"),
      city: formData.get("city"),
      country: formData.get("country"),
      services: String(formData.get("services") ?? "")
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean),
      latitude: Number(formData.get("latitude")),
      longitude: Number(formData.get("longitude")),
      prayerTimes: formData.get("prayerTimes")
    };

    const response = await fetch("/api/mosques", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": "dev-token"
      },
      body: JSON.stringify(payload)
    });

    setStatus(response.ok ? "Mosque submitted." : "Submission failed.");
  }

  return (
    <section className="space-y-4">
      <h1>Add Mosque</h1>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <LabeledInput required name="name" label="Mosque name" />
        <LabeledInput required name="city" label="City" />
        <LabeledInput required name="country" label="Country" />
        <LabeledInput name="services" label="Services (comma separated)" />
        <LabeledInput required type="number" step="any" name="latitude" label="Latitude" />
        <LabeledInput required type="number" step="any" name="longitude" label="Longitude" />
        <LabeledTextarea name="prayerTimes" label="Prayer times note" rows={3} />
        <button type="submit" style={{ padding: "0.5rem 1rem", background: "#065f46", color: "white", border: 0, borderRadius: 8 }}>
          Submit
        </button>
      </form>
      {status ? <p>{status}</p> : null}
    </section>
  );
}
