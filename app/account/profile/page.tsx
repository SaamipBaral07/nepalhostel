"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button, Input } from "@/components/ui";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { authApi } from "@/lib/api/auth";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    phone: "",
  });

  if (!user) return null;

  const validateForm = () => {
    const newErrors = {
      fullName: "",
      phone: "",
    };

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    if (formData.phone && !/^[+]?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return !newErrors.fullName && !newErrors.phone;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      // Send data with camelCase keys to match backend serializer
      const updateData = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
      };

      console.log("Sending update request:", updateData);

      const response = await authApi.updateProfile(updateData);

      console.log("Profile update response:", response);

      // The response is wrapped in { data: user }
      const updatedUser = response.data;
      
      // Update user in context
      updateUser(updatedUser);

      setSuccessMessage("Profile updated successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error: any) {
      console.error("Profile update error:", error);
      
      // Handle different error formats
      let errorMsg = "Failed to update profile. Please try again.";
      
      if (error.errors) {
        // Field-specific errors
        const fieldErrors = Object.values(error.errors).flat();
        errorMsg = fieldErrors.join(", ");
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setErrorMessage(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const hasChanges = 
    formData.fullName !== user.fullName || 
    formData.phone !== user.phone;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 lg:px-8">
      {/* Header with Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/account")}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <h1 className="text-xl font-bold text-zinc-900 sm:text-2xl">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage your account information
        </p>
      </div>

      <div className="mt-8 max-w-xl space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={formData.fullName}
              className="h-20 w-20 rounded-full border-2 border-zinc-200 object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-700">
              {formData.fullName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-zinc-900">{formData.fullName}</p>
            <p className="text-sm capitalize text-zinc-500">{user.role}</p>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
          <Input
            id="fullName"
            label="Full Name"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            error={errors.fullName}
            placeholder="Enter your full name"
            required
          />
          
          <Input
            id="email"
            label="Email"
            type="email"
            value={user.email}
            disabled
            helperText="Email cannot be changed"
          />
          
          <Input
            id="phone"
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            error={errors.phone}
            placeholder="+977-9841234567"
          />

          <div className="flex items-center gap-3 pt-2">
            <Button 
              type="submit" 
              disabled={!hasChanges || isSaving}
              isLoading={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            
            {hasChanges && !isSaving && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setFormData({
                    fullName: user.fullName,
                    phone: user.phone,
                  });
                  setErrors({ fullName: "", phone: "" });
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
