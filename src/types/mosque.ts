export interface Announcement {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

export interface Mosque {
  id: string;
  name: string;
  city: string;
  country: string;
  madhab?: string | null;
  prayerTimes?: string | null;
  services: string[];
  latitude: number;
  longitude: number;
  announcements: Announcement[];
}
