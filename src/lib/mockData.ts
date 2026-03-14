import { Mosque } from "@/types/mosque";

export const sampleMosques: Mosque[] = [
  {
    id: "m1",
    name: "Al Noor Community Mosque",
    city: "London",
    country: "UK",
    madhab: "Shafi",
    prayerTimes: "Published daily",
    services: ["Quran classes", "Family counseling", "Food bank"],
    latitude: 51.5079,
    longitude: -0.0877,
    announcements: [
      {
        id: "a1",
        title: "Ramadan food drive",
        body: "Drop-off starts after Asr this Friday.",
        createdAt: "2026-02-01"
      }
    ]
  },
  {
    id: "m2",
    name: "Masjid Al Falah",
    city: "Manchester",
    country: "UK",
    madhab: "Hanafi",
    prayerTimes: "Displayed in app",
    services: ["Weekend school", "Youth circle", "Nikah services"],
    latitude: 53.4838,
    longitude: -2.2446,
    announcements: []
  }
];
