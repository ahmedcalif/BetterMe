"use client";

import { updateProfile } from "@/app/settings/actions";
import Image from "next/image";
import { useState } from "react";

interface ProfileSettingsProps {
  email: string;
  firstName: string | null;
  lastName: string | null;
  picture: string | null;
}

export default function ProfileSettings({
  email,
  firstName,
  lastName,
  picture,
}: ProfileSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: firstName || "",
    lastName: lastName || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const result = await updateProfile(formData);

    if (result.success) {
      setMessage({
        type: "success",
        text: result.message || "Profile updated",
      });
      setIsEditing(false);
    } else {
      setMessage({
        type: "error",
        text: result.error || "Failed to update profile",
      });
    }

    setIsSaving(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: firstName || "",
      lastName: lastName || "",
    });
    setIsEditing(false);
    setMessage(null);
  };

  return (
    <div className="space-y-4">
      {/* Avatar and Email (read-only) */}
      <div className="flex items-center gap-4 pb-4 border-b border-sage/20">
        {picture ? (
          <Image
            src={picture}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover border-2 border-sage"
            width={64}
            height={64}
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center text-bark text-xl font-bold">
            {(firstName?.[0] || email[0] || "?").toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-sm text-stone mb-1">Email</p>
          <p className="text-bark font-medium">{email}</p>
        </div>
      </div>

      {/* Name Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-bark mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-sage/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest disabled:bg-gray-50 disabled:text-gray-600"
              placeholder="Enter first name"
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-bark mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-sage/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest disabled:bg-gray-50 disabled:text-gray-600"
              placeholder="Enter last name"
            />
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-forest text-cream rounded-lg hover:bg-forest/90 transition-colors"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-forest text-cream rounded-lg hover:bg-forest/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="px-4 py-2 bg-gray-200 text-bark rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
