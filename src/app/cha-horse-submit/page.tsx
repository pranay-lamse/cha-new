"use client";
import React, { useState } from "react";
import Loader from "@/components/Loader"; // Update path as needed
import { env } from "@/env";

export default function EditAccountPage() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <style jsx global>{`
        header.w-full.z-99 {
          display: none !important;
        }
        .hidden.topbar.md\:block.w-full.bg-golden-light {
          display: none !important;
        }
        .footer.bg-deep-navy {
          display: none !important;
        }
        .footer-bar.grid.md\\:grid-cols-2.grid-cols.bg-golden-light.p-2 {
          display: none !important;
        }
        .elementor-element.elementor-element-a128659 .elementor-heading-title {
          line-height: 1.2em !important;
        }

        .elementor-widget-heading .elementor-heading-title > a {
          font-family: "Cormorant", sans-serif;
        }
        body {
          background: #0f335f !important;
        }
        html,
        body {
          overflow: hidden;
        }
      `}</style>

      <div className="fixed inset-0 cha-horse-submit flex items-center justify-center bg-[#0f335f] z-[9999]">
        <iframe
          src={`${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/cha-horse-submit-2`}
          className="w-screen h-screen border-none"
          title="CHA Horse Submit"
          onLoad={() => setLoading(false)}
        ></iframe>
      </div>
    </>
  );
}
