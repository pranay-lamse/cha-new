"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { marcellus } from "@/config/fonts";
import { ReCaptcha } from "next-recaptcha-v3";

export const Newsletter = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+SC:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const [token, setToken] = useState<string>();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = new URLSearchParams();
      payload.append("post_id", "45");
      payload.append("form_id", "fbcabc1");
      payload.append("referer_title", "Home - CHA Staging");
      payload.append("queried_id", "45");
      payload.append("action", "elementor_pro_forms_send_form");
      payload.append("referrer", "https://classichorseauction.com/stage/");

      // 🟢 Match these with actual input names
      payload.append("form_fields[field_4d610d9]", formData.name);
      payload.append("form_fields[field_493edd0]", formData.email);
      payload.append("form_fields[field_1c8282a]", formData.phone);

      const resposonse = await axios.post(
        "https://classichorseauction.com/stage/wp-admin/admin-ajax.php",
        payload.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (resposonse.data.success) {
        setSuccess(true);
        setFormData({ name: "", email: "", phone: "" });
      } else {
        setError(resposonse.data?.data?.message || "Submission failed.");
      }
    } catch (err: any) {
      console.error("Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-deep-navy py-4 my-20 md:my-24">
      <div className="grid gap-4 md:gap-8 md:grid-cols-2 grid-cols-1 w-11/12 mx-auto max-w-[1140px]">
        <div className="md:p-3">
          <h4 className={`${marcellus.className} text-golden-light text-4xl`}>
            Don&apos;t Miss The Upcoming Auction. Subscribe to Our Newsletter
          </h4>
        </div>
        <form onSubmit={handleSubmit} className="md:p-3">
          <div className="grid gap-2 md:gap-2 md:grid-cols-3 grid-cols-1 mt-3 newsletter">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your Name"
              style={{ fontFamily: "Cormorant_SC" }}
              className="block w-full h-11 px-5 py-2.5 bg-white border border-golden-light rounded-md text-gray-900 placeholder-opacity-60 placeholder-black focus:outline-none"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Your Email"
              style={{ fontFamily: "Cormorant_SC" }}
              className="block w-full h-11 px-5 py-2.5 bg-white border border-golden-light rounded-md text-gray-900 placeholder-opacity-60 placeholder-black focus:outline-none"
              required
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Your Phone Number"
              style={{ fontFamily: "Cormorant_SC" }}
              className="block w-full h-11 px-5 py-2.5 bg-white border border-golden-light rounded-md text-gray-900 placeholder-opacity-60 placeholder-black focus:outline-none"
              required
            />
            <input type="hidden" name="token-recaptcha" value={token} />
            <ReCaptcha onValidate={setToken} action="newsletter" />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 text-white bg-golden-bold border border-golden-bold font-bold text-[14px] px-8 py-2 hover:bg-transparent hover:text-golden-bold transition duration-300"
          >
            {isSubmitting ? "Submitting..." : "Subscribe"}
          </button>
          {error && <p className="text-red-500 mt-2 form-error">{error}</p>}
          {success && (
            <p className="text-white mt-2 form-success">Your submission was successful.</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Newsletter;
