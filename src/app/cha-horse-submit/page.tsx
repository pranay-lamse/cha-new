"use client";
import React from "react";

export default function EditAccountPage() {
  return (
    <>
      <style jsx global>{`
        header.w-full.z-99 {
          display: none !important;
        }

        .hidden.topbar.md\\:block.w-full.bg-golden-light {
          display: none !important;
        }

        .footer.bg-deep-navy {
          display: none !important;
        }

        .footer-bar.grid.md\\:grid-cols-2.grid-cols.bg-golden-light.p-2 {
          display: none !important;
        }

        body {
          background: #0f335f !important;
        }
      `}</style>

      <iframe
        src="https://classichorseauction.com/stage/cha-horse-submit-2/"
        className="w-screen h-screen border-none"
        title="CHA Horse Submit"
      ></iframe>
    </>
  );
}
