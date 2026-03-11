"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPinned } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button, Input, Select } from "@/components/ui";
import { GENDER_CATEGORIES, AMENITY_OPTIONS } from "@/lib/constants";
import { hostelsApi } from "@/lib/api/hostels";
import type { City } from "@/lib/types";

export default function AddHostelPage() {
  return (
    <ProtectedRoute allowedRoles={["host"]}>
      <AddHostelForm />
    </ProtectedRoute>
  );
}

function AddHostelForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    hostelsApi.getCities().then((res) => setCities(res.data)).catch(() => {});
  }, []);

  // Form state
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [genderCategory, setGenderCategory] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [pricePerMonth, setPricePerMonth] = useState("");
  const [totalBeds, setTotalBeds] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("city", city);
      formData.append("genderCategory", genderCategory);
      formData.append("address", address);
      formData.append("description", description);
      formData.append("pricePerNight", pricePerNight);
      formData.append("pricePerMonth", pricePerMonth);
      formData.append("totalBeds", totalBeds);
      if (latitude) formData.append("latitude", latitude);
      if (longitude) formData.append("longitude", longitude);
      selectedAmenities.forEach((a) => formData.append("amenities", a));
      images.forEach((file) => formData.append("images", file));

      await hostelsApi.create(formData);
      router.push("/account/hostels");
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message || "Failed to create hostel. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 lg:px-8">
      <Link
        href="/account/hostels"
        className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-emerald-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Hostels
      </Link>

      <h1 className="text-xl font-bold text-zinc-900 sm:text-2xl">
        Add New Hostel
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        List your hostel on नेपाल Hostel Finder
      </p>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6 rounded-xl border border-zinc-200 bg-white p-6"
      >
        {/* Basic Info */}
        <div>
          <h2 className="text-base font-semibold text-zinc-900">
            Basic Information
          </h2>
          <div className="mt-4 space-y-4">
            <Input
              id="name"
              label="Hostel Name"
              placeholder="e.g., Himalayan Student Hostel"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select
                id="city"
                label="City"
                placeholder="Select City"
                options={cities.map((c) => ({ value: c.name, label: c.name }))}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              <Select
                id="genderCategory"
                label="Category"
                placeholder="Select Category"
                options={GENDER_CATEGORIES.map((g) => ({
                  value: g.value,
                  label: g.label,
                }))}
                value={genderCategory}
                onChange={(e) => setGenderCategory(e.target.value)}
                required
              />
            </div>
            <Input
              id="address"
              label="Full Address"
              placeholder="e.g., Bagbazar, Kathmandu 44600"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            {/* Location coordinates */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-zinc-700">GPS Location</label>
                <button
                  type="button"
                  onClick={() => {
                    if (!navigator.geolocation) return;
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        setLatitude(pos.coords.latitude.toFixed(6));
                        setLongitude(pos.coords.longitude.toFixed(6));
                      },
                      () => {},
                      { enableHighAccuracy: true }
                    );
                  }}
                  className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700"
                >
                  <MapPinned className="h-3.5 w-3.5" />
                  Use my location
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  id="latitude"
                  label=""
                  placeholder="Latitude (e.g., 27.7172)"
                  type="number"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                />
                <Input
                  id="longitude"
                  label=""
                  placeholder="Longitude (e.g., 85.3240)"
                  type="number"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                />
              </div>
              <p className="mt-1 text-xs text-zinc-400">Coordinates help guests find nearby hostels</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                Description
              </label>
              <textarea
                className="mt-1.5 flex min-h-[120px] w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Describe your hostel — facilities, environment, rules..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="border-t border-zinc-100 pt-6">
          <h2 className="text-base font-semibold text-zinc-900">
            Pricing & Capacity
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              id="pricePerNight"
              label="Price per Night (Rs.)"
              type="number"
              placeholder="500"
              value={pricePerNight}
              onChange={(e) => setPricePerNight(e.target.value)}
              required
            />
            <Input
              id="pricePerMonth"
              label="Price per Month (Rs.)"
              type="number"
              placeholder="8000"
              value={pricePerMonth}
              onChange={(e) => setPricePerMonth(e.target.value)}
              required
            />
            <Input
              id="totalBeds"
              label="Total Beds"
              type="number"
              placeholder="20"
              value={totalBeds}
              onChange={(e) => setTotalBeds(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Amenities */}
        <div className="border-t border-zinc-100 pt-6">
          <h2 className="text-base font-semibold text-zinc-900">Amenities</h2>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {AMENITY_OPTIONS.map((amenity) => (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  selectedAmenities.includes(amenity)
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
                }`}
              >
                {selectedAmenities.includes(amenity) ? "✓ " : ""}
                {amenity}
              </button>
            ))}
          </div>
        </div>

        {/* Photos */}
        <div className="border-t border-zinc-100 pt-6">
          <h2 className="text-base font-semibold text-zinc-900">Photos</h2>
          <p className="mt-1 text-xs text-zinc-400">
            First image will be the primary photo. JPG, PNG up to 5MB each.
          </p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files) setImages(Array.from(e.target.files));
            }}
            className="mt-4 block w-full text-sm text-zinc-500 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-emerald-700 hover:file:bg-emerald-100"
          />
          {images.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {images.map((file, i) => (
                <div
                  key={i}
                  className="relative h-20 w-20 overflow-hidden rounded-lg border border-zinc-200"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-full w-full object-cover"
                  />
                  {i === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-emerald-600/80 px-1 py-0.5 text-center text-[10px] font-medium text-white">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 border-t border-zinc-100 pt-6">
          <Button type="submit" size="lg" isLoading={isSubmitting}>
            Submit Hostel
          </Button>
          <Link href="/account/hostels">
            <Button type="button" variant="outline" size="lg">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
