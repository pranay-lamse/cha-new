// ListingPopup.tsx
'use client';

import { useEffect, useState } from 'react';

export default function ListingPopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
<div className="bg-[#0F335F] p-10 rounded-xl w-[640px] shadow-lg relative">

        <button
          onClick={() => setShowPopup(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
        >
          ×
        </button>

       <h2 className="text-[35px] font-normal italic-0 leading-none text-center font-[Marcellus] text-white mb-10">
        Don’t Miss a New Listing
        </h2>

        <form method="post" name="New Form">
          <input type="hidden" name="post_id" value="3833" />
          <input type="hidden" name="form_id" value="eb4b3f9" />
          <input type="hidden" name="referer_title" value="Home - CHA Staging" />
          <input type="hidden" name="queried_id" value="45" />

          <div className="space-y-4">
            <input
              type="text"
              name="form_fields[name]"
              placeholder="Your Name"
              className="min-h-[47px] px-4 py-[6px] max-w-full align-middle w-full bg-white border rounded text-[14px] font-normal text-[#222] font-raleway"
            />
            <input
              type="email"
              name="form_fields[field_493edd0]"
              placeholder="Your Email"
              className="min-h-[47px] px-4 py-[6px] max-w-full align-middle w-full bg-white border rounded text-[14px] font-normal text-[#222] font-raleway"
            />
            <input
              type="tel"
              name="form_fields[field_1c8282a]"
              placeholder="Your Phone Number"
              className="min-h-[47px] px-4 py-[6px] max-w-full align-middle w-full bg-white border rounded text-[14px] font-normal text-[#222] font-raleway"
            />
            <button
            type="submit"
            className="w-full min-h-[42px] text-white font-bold font-raleway bg-blue-600 rounded-none  text-yellow-500"
            >
            Send
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}
