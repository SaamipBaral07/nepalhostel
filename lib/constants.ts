// ============================================================
// नेपाल Hostel Finder — Application Constants
// ============================================================

export const APP_NAME = "नेपाल Hostel Finder";
export const APP_DESCRIPTION =
  "Find and book the best hostels across Nepal — for students, travelers, and everyone in between.";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const CITIES = [
  "Kathmandu",
  "Pokhara",
  "Lalitpur",
  "Bhaktapur",
  "Chitwan",
  "Lumbini",
  "Biratnagar",
  "Dharan",
  "Butwal",
  "Hetauda",
] as const;

export type City = (typeof CITIES)[number];

export const GENDER_CATEGORIES = [
  { value: "boys", label: "Boys" },
  { value: "girls", label: "Girls" },
  { value: "unisex", label: "Unisex" },
  { value: "tourist", label: "Tourist" },
] as const;

export const STAY_TYPES = [
  {
    value: "short",
    label: "Short Stay",
    description: "1–7 days • Full payment",
  },
  {
    value: "long",
    label: "Long Stay",
    description: "1–12 months • Advance + monthly",
  },
] as const;

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
};

export const AMENITY_OPTIONS = [
  "Wi-Fi",
  "Hot Water",
  "Laundry",
  "Kitchen",
  "Parking",
  "CCTV",
  "Generator Backup",
  "Study Room",
  "Common Area",
  "Rooftop",
  "Meal Included",
  "Locker",
] as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/hostels", label: "Hostels" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const ITEMS_PER_PAGE = 12;
