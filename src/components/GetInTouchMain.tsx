"use client";
import { useState } from "react";
import { marcellus, raleway } from "@/config/fonts";
import { ReCaptcha } from "next-recaptcha-v3";
import { env } from "@/env";

export const GetInTouchMain = ({ isContact = false }) => {
  const [token, setToken] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    // Append fixed required WordPress payload fields
    formData.append("action", "elementor_pro_forms_send_form");
    formData.append("post_id", "45");
    formData.append("form_id", "a078974");
    formData.append("referer_title", "Contact - CHA Staging");
    formData.append("queried_id", "45");

    // Format data like: form_fields[name], form_fields[message], etc.
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");

    const message = formData.get("message");

    formData.append("form_fields[name]", name as string);

    formData.append("form_fields[field_493edd0]", email as string);

    formData.append("form_fields[field_1c8282a]", phone as string);
    formData.append("g-recaptcha-response", token || "");

    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/wp-admin/admin-ajax.php`,
        {
          method: "POST",
          body: formData,
        }
      );

      const text = await res.text();
      setResponse("Success!");
    } catch (err) {
      console.error(err);
      setResponse("Error submitting form.");
    } finally {
      setLoading(false);
      setTimeout(() => {
        (e.target as HTMLFormElement).reset();
      }, 100); // 100ms delay
    }
  };

  return (
    <div className="w-11/12 mx-auto mb-24">
      <div className="mb-5">
        <h2
          className={`${marcellus.className} text-black text-[26px] md:text-4xl text-center`}
        >
          GET IN TOUCH
        </h2>
      </div>
      <div className="mb-9">
        <p
          className={`${raleway.className} text-[14px] text-[#222] text-center leading-[1.8em]`}
        >
          Need help with Horse selection or general questions about the process?
          Fill out the form and someone will get with you.
        </p>
      </div>

      <div className="md:w-9/12 w-full mx-auto max-w-[800px] get-into">
        <form onSubmit={handleSubmit} className="px-0 md:px-8">
          <div className="two-inputs">
            <div className="relative md:mb-3 mb-2 name-input">
              <input
                type="text"
                name="name"
                className={`${raleway.className} block w-full focus:outline-none`}
                placeholder="Your Name"
                required
              />
            </div>

            <div className="relative md:mb-3 mb-3 phone-input">
              <input
                type="email"
                name="email"
                className={`${raleway.className} block w-full focus:outline-none`}
                placeholder="Your Email"
                required
              />
            </div>
            <div className="relative md:mb-3 mb-3 phone-input">
              <input
                type="text"
                name="phone"
                className={`${raleway.className} block w-full focus:outline-none`}
                placeholder="Your Phone Number"
                required
              />
            </div>
          </div>

          <div className="relative md:mb-3 mb-3">
            <input type="hidden" name="token-recaptcha" value={token} />
            <ReCaptcha onValidate={setToken} action="getintouch" />
          </div>

          <div className="flex justify-center mt-10">
            <button
              type="submit"
              disabled={loading}
              className="focus:outline-none w-24 text-white bg-golden-bold border border-golden-bold font-bold text-[14px] leading-[1.8em] text-center px-8 py-2.5 font-raleway transition-all duration-300 hover:bg-white hover:text-golden-bold hover:border-golden-bold"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </form>

        {response && (
          <div className="text-center mt-5 text-green-600 font-medium">
            {response}
          </div>
        )}
      </div>
    </div>
  );
};
