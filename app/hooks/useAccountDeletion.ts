"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useAccountDeletion() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deleteAccount = async () => {
    if (confirmText !== "DELETE") {
      setError("Please type DELETE to confirm");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/user/delete", {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete account");
      }

      await signOut({ redirect: false });
      router.push("/");
    } catch (err) {
      setError("Failed to delete account. Please try again.");
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setConfirmText("");
    setError("");
  };

  return {
    showModal,
    setShowModal,
    confirmText,
    setConfirmText,
    loading,
    error,
    deleteAccount,
    resetForm,
  };
}
