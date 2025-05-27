"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [key, setKey] = useState("");
  const [id, setId] = useState("");
  const [login, setLogin] = useState("");

  const [valid, setValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");

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
          `${
            process.env.NEXT_PUBLIC_API_URL_CUSTOM_API
          }/wp-json/custom/v1/validate-reset-key?key=${encodeURIComponent(
            keyParam
          )}&id=${encodeURIComponent(idParam)}&login=${encodeURIComponent(
            loginParam
          )}`
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
    if (!newPassword) {
      alert("Please enter a new password.");
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
        alert("Password updated successfully!");
        router.push("/my-account");
      } else {
        alert("Failed to update password: " + (data.message || ""));
      }
    } catch (e) {
      alert("Something went wrong while updating password.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (valid === false)
    return (
      <div>
        <h2>Invalid or expired reset link</h2>
        {error && <p>{error}</p>}
      </div>
    );

  if (valid === null) return null;

  return (
    <div className="container mx-auto max-w-md p-6 border rounded shadow mt-10">
      <h2 className="text-xl font-semibold mb-4">Reset Your Password</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          New Password:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded mt-1"
            required
            minLength={6}
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
