"use client";

import { deleteAccount } from "@/app/settings/actions";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useState } from "react";
import { Modal } from "../ui/Modal";

export default function AccountSettings() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (confirmText !== "DELETE") {
      setError("Please type DELETE to confirm");
      return;
    }

    setIsDeleting(true);
    setError(null);

    const result = await deleteAccount();

    if (result.success) {
      window.location.href = "/api/auth/logout";
    } else {
      setError(result.error || "Failed to delete account");
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-red-600">
        Irreversible actions that affect your account and data.
      </p>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h3 className="font-medium text-bark mb-1">Sign Out</h3>
          <p className="text-sm text-stone">
            Sign out of your account on this device
          </p>
        </div>
        <LogoutLink className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
          Sign Out
        </LogoutLink>
      </div>

      <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
        <div>
          <h3 className="font-medium text-red-700 mb-1">Delete Account</h3>
          <p className="text-sm text-red-600">
            Permanently delete your account and all associated data
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Delete Account
        </button>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setConfirmText("");
          setError(null);
        }}
        title="Delete Account"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 font-medium mb-2">Warning</p>
            <p className="text-sm text-red-600">
              This action cannot be undone. This will permanently delete your
              account, including:
            </p>
            <ul className="mt-2 text-sm text-red-600 list-disc list-inside space-y-1">
              <li>All your goals and progress</li>
              <li>All your steps and tracking data</li>
              <li>Your profile information</li>
            </ul>
          </div>

          <div>
            <label
              htmlFor="confirmDelete"
              className="block text-sm font-medium text-bark mb-2"
            >
              Type <span className="font-bold">DELETE</span> to confirm
            </label>
            <input
              type="text"
              id="confirmDelete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="DELETE"
              disabled={isDeleting}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => {
                setShowDeleteModal(false);
                setConfirmText("");
                setError(null);
              }}
              disabled={isDeleting}
              className="px-4 py-2 bg-gray-200 text-bark rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || confirmText !== "DELETE"}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
