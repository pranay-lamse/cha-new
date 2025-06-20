"use client";
import React from "react";

export default function EditAccountPage() {
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

      <iframe
        src="https://classichorseauction.com/stage/cha-horse-submit-2/"
        className="w-screen h-screen border-none cha-horse-submit-text"
        title="CHA Horse Submit"
      ></iframe>
    </>
  );
}
