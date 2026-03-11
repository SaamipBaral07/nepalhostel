"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Building2, DollarSign, Sparkles, ImageIcon, Check, MapPinned } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button, Input, Select } from "@/components/ui";
import { GENDER_CATEGORIES, AMENITY_OPTIONS } from "@/lib/constants";
import { hostelsApi } from "@/lib/api/hostels";
import type { City, Hostel } from "@/lib/types";

export default function EditHostelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <ProtectedRoute allowedRoles={["host"]}>
      <EditHostelForm hostelId={id} />
    </ProtectedRoute>
  );
}

function EditHostelForm({ hostelId }: { hostelId: string }) {
  const router = useRouter();
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [cities, setCities] = useState<City[]>([]);

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

  useEffect(() => {
    hostelsApi.getCities().then((res) => setCities(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    hostelsApi
      .getBySlug(hostelId)
      .then((res) => {
        const h = res.data;
        setHostel(h);
        setName(h.name);
        setCity(h.city);
        setGenderCategory(h.genderCategory);
        setAddress(h.address);
        setDescription(h.description);
        setPricePerNight(String(h.pricePerNight));
        setPricePerMonth(String(h.pricePerMonth));
        setTotalBeds(String(h.totalBeds));
        setLatitude(h.latitude ? String(h.latitude) : "");
        setLongitude(h.longitude ? String(h.longitude) : "");
        setSelectedAmenities(h.amenities.map((a) => a.name));
      })
      .catch(() => setError("Failed to load hostel."))
      .finally(() => setIsLoading(false));
  }, [hostelId]);

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

      await hostelsApi.update(hostelId, formData);
      router.push("/account/hostels");
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message || "Failed to update hostel. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-zinc-500">Hostel not found.</p>
        <Link href="/account/hostels" className="mt-4 inline-block text-sm text-emerald-600 hover:underline">
          Back to My Hostels
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/60">
      <div className="mx-auto max-w-4xl px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 lg:px-8">
        <Link
          href="/account/hostels"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-emerald-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Hostels
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
            Edit Hostel
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            Update your hostel listing details
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Building2 className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-zinc-900">Basic Information</h2>
            </div>

            <div className="space-y-4">
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
                  className="mt-1.5 flex min-h-[120px] w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                  placeholder="Describe your hostel — facilities, environment, rules..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Pricing & Capacity Card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                <DollarSign className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-zinc-900">Pricing & Capacity</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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

          {/* Amenities Card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-zinc-900">Amenities</h2>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
              {AMENITY_OPTIONS.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-2.5 rounded-xl border-2 px-3.5 py-3 text-sm font-medium transition-all ${
                      isSelected
                        ? "border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm"
                        : "border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
                    }`}
                  >
                    <div className={`flex h-5 w-5 items-center justify-center rounded-md ${
                      isSelected ? "bg-emerald-500 text-white" : "border border-zinc-300 bg-white"
                    }`}>
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    {amenity}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photos Card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">Photos</h2>
                <p className="text-xs text-zinc-400">
                  Upload new photos to replace existing ones. Leave empty to keep current photos.
                </p>
              </div>
            </div>

            {/* Existing images */}
            {images.length === 0 && hostel.images.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-zinc-500 mb-2">
                  Current photos ({hostel.images.length})
                </p>
                <div className="flex flex-wrap gap-3">
                  {hostel.images.map((img, i) => (
                    <div
                      key={img.id}
                      className="relative h-24 w-24 overflow-hidden rounded-xl border border-zinc-200 shadow-sm"
                    >
                      <img
                        src={img.url}
                        alt={img.altText || ""}
                        className="h-full w-full object-cover"
                      />
                      {i === 0 && (
                        <span className="absolute bottom-0 left-0 right-0 bg-emerald-600/90 px-1 py-0.5 text-center text-[10px] font-semibold text-white">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-xl border-2 border-dashed border-zinc-200 p-6 text-center transition-colors hover:border-emerald-300 hover:bg-emerald-50/30">
              <ImageIcon className="mx-auto h-8 w-8 text-zinc-300" />
              <p className="mt-2 text-sm text-zinc-500">
                Click to upload or drag and drop
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  if (e.target.files) setImages(Array.from(e.target.files));
                }}
                className="mt-3 block w-full text-sm text-zinc-500 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-emerald-700 hover:file:bg-emerald-100 file:cursor-pointer"
              />
            </div>

            {images.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {images.map((file, i) => (
                  <div
                    key={i}
                    className="relative h-24 w-24 overflow-hidden rounded-xl border border-zinc-200 shadow-sm"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                    {i === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 bg-emerald-600/90 px-1 py-0.5 text-center text-[10px] font-semibold text-white">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="submit" size="lg" isLoading={isSubmitting}>
              Save Changes
            </Button>
            <Link href="/account/hostels">
              <Button type="button" variant="outline" size="lg">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
