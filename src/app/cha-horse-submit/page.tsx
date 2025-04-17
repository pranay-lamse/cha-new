"use client";

import { env } from "@/env";

export default function HoursSubmitPage() {
  return (
    <div className="w-full h-screen">
      <iframe
        src={`${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/cha-horse-submit`}
        className="w-full h-full"
        frameBorder="0"
      ></iframe>
    </div>
  );
}
