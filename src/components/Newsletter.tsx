"use client";
import { newsletter } from "@/actions";
import { marcellus, cormorantSC } from "@/config/fonts";
import { useActionState, useState, useEffect } from "react";
import { ReCaptcha } from "next-recaptcha-v3";

export const Newsletter = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+SC:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const [state, action, pending] = useActionState(newsletter, undefined);
  const [token, setToken] = useState<string>();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="bg-deep-navy py-4 my-20 md:my-24">
      <div className="grid gap-4 md:gap-8 md:grid-cols-2 grid-cols-1 w-11/12 mx-auto max-w-[1140px]">
        <div className="md:p-3">
          <h4 className={`${marcellus.className} text-golden-light text-4xl`}>
            Don&apos;t Miss The Upcoming Auction. Subscribe to Our Newsletter
          </h4>
        </div>
        <form action={action} className="md:p-3">
          <div className="grid gap-2 md:gap-2 md:grid-cols-3 grid-cols-1 mt-3 newsletter">
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name} // Controlled input
                onChange={handleInputChange}
                className="block w-full h-11 px-5 py-2.5 bg-white leading-7 text-base font-normal shadow-xs text-gray-900 border border-golden-light rounded-md placeholder-opacity-60 placeholder-black placeholder:uppercase focus:outline-none"
                placeholder="Your Name"
                style={{ fontFamily: "Cormorant_SC" }}
              />
              {state?.errors?.name && (
                <p className="text-red-600">{state.errors.name}</p>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                name="email"
                value={formData.email} // Controlled input
                onChange={handleInputChange}
                className="block w-full h-11 px-5 py-2.5 bg-white leading-7 text-base font-normal shadow-xs text-gray-900 border border-golden-light rounded-md placeholder-opacity-60 placeholder-black placeholder:uppercase focus:outline-none"
                placeholder="Your Email"
                style={{ fontFamily: "Cormorant_SC" }}
              />
              {state?.errors?.email && (
                <p className="text-red-600">{state.errors.email}</p>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                name="phone"
                value={formData.phone} // Controlled input
                onChange={handleInputChange}
                className="block w-full h-11 px-5 py-2.5 bg-white leading-7 text-base font-normal shadow-xs text-gray-900 border border-golden-light rounded-md placeholder-opacity-60 placeholder-black placeholder:uppercase focus:outline-none"
                placeholder="Your Phone Number"
                style={{ fontFamily: "Cormorant_SC" }}
              />
              {state?.errors?.phone && (
                <p className="text-red-600">{state.errors.phone}</p>
              )}
            </div>
            <div className="relative">
              <input type="hidden" name="token-recaptcha" value={token} />
              {state?.errors?.tokenRecaptcha && (
                <p className="text-red-600">{state.errors.tokenRecaptcha}</p>
              )}
              <ReCaptcha onValidate={setToken} action="newsletter" />
            </div>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="focus:outline-none w-full text-white bg-golden-bold border border-golden-bold font-bold text-[14px] text-center px-8 py-2 me-2 mb-2 transition duration-300 hover:bg-transparent hover:border-golden-bold hover:text-golden-bold mt-1"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;
