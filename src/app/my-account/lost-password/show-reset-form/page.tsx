"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [key, setKey] = useState("");
  const [id, setId] = useState("");
  const [login, setLogin] = useState("");

  const [valid, setValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notice, setNotice] = useState<{ type: "error" | "success"; message: string } | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const keyParam = searchParams.get("key") || "";
    const idParam = searchParams.get("id") || "";
    const loginParam = searchParams.get("login") || "";

    setKey(keyParam);
    setId(idParam);
    setLogin(loginParam);

    if (!keyParam || !idParam || !loginParam) {
      setValid(false);
      setError("Missing reset parameters.");
      return;
    }

    const validateResetKey = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_CUSTOM_API}/wp-json/custom/v1/validate-reset-key?key=${encodeURIComponent(
            keyParam
          )}&id=${encodeURIComponent(idParam)}&login=${encodeURIComponent(loginParam)}`
        );
        const data = await res.json();
        if (data.valid) {
          setValid(true);
          setError(null);
        } else {
          setValid(false);
          setError(data.message || "Invalid reset link.");
        }
      } catch (e) {
        setValid(false);
        setError("Error validating reset link.");
      } finally {
        setLoading(false);
      }
    };

    validateResetKey();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setNotice({ type: "error", message: "Please fill in both password fields." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setNotice({ type: "error", message: "Passwords do not match." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_CUSTOM_API}/wp-json/custom/v1/update-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            key,
            login,
            password: newPassword,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setNotice({ type: "success", message: "Password updated successfully! Redirecting..." });
        setTimeout(() => router.push("/my-account"), 1500);
      } else {
        setNotice({ type: "error", message: data.message || "Failed to update password." });
      }
    } catch (e) {
      setNotice({ type: "error", message: "Something went wrong while updating password." });
    } finally {
      setLoading(false);
    }
  };

  // if (loading && valid === null) return <Loader />;

  if (valid === false)
    return (
       <div className="container mx-auto w-full sm:w-11/12 lg:w-[1100px] my-10 sm:my-20 uwa-auctions-page px-3 md:px-0 checkout-page password-lost">
          <h2 className="font-semibold mb-2">Invalid or expired reset link</h2>
          {error && <p>{error}</p>}
        </div>
    );

  return (
    <div className="container mx-auto w-full sm:w-11/12 lg:w-[1100px] my-10 sm:my-20 uwa-auctions-page px-3 md:px-0 checkout-page password-lost">
       {notice && (
        <div className="woocommerce-notices-wrapper">
          <div
            className={`woocommerce-${notice.type}`}
          >
            {notice.message}
          </div>
          </div>
        )}
      <div className="reset-form woocommerce-ResetPassword lost_reset_password">
        <p className="mb-4 text-gray-700">Enter a new password below.</p>

       

        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            New Password:
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              required
              minLength={6}
            />
            <small className="woocommerce-password-hint">Hint: The password should be at least twelve characters long. To make it stronger, use upper and lower case letters, numbers, and symbols like ! " ? $ % ^ &amp; ).</small>
          </label>

          <label className="block mb-4">
            Re-enter New Password:
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              required
              minLength={6}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="woocommerce-Button button"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
