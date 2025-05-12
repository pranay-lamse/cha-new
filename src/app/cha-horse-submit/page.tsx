"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import styles from "./SubmitForm.module.css";
import Image from "next/image";
import { marcellus, raleway, cormorantSC, lora } from "@/config/fonts";

export default function HoursSubmitPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    ahsNo: "",
    microchipNo: "",
    uelnNo: "",
    dob: "",
    gender: "Mare",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    country: "United States",
    horseName: "",
    breed: "",
    color: "",
    height: "",
    description: "",
    registered: false,
    registrationNumber: "",
    markings: "",
    sex: "Mare",
    documents: null,
    youtubeLinks: "",
    location: "",
    buyItNowPrice: "",
    reservePrice: "",
    listingLength: "2 Weeks",
    driverLicense: null,
    horsePhotos: null,
    agreeToTerms: false,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, [name]: files });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <>
      <Head>
        <title>Auction Your Horse</title>
        <meta name="description" content="Submit your horse for auction" />
      </Head>

      {/* ✅ Global CSS for hiding header and topbar */}
      <style jsx global>{`
        header.w-full.z-99 {
          display: none !important;
        }

        .hidden.topbar.md\:block.w-full.bg-golden-light {
          display: none !important;
        }
          .footer.bg-deep-navy {
    display: none;
        }
            .footer-bar.grid.md\:grid-cols-2.grid-cols.bg-golden-light.p-2 {
            display: none;
        }
            body {
            background: #0f335f;
        }
      `}</style>

      <div className="container mx-auto w-full sm:w-11/12 lg:w-[1170px] my-10 sm:my-20 about px-2 sm:px-0">
        <div className="relative justify-center border-4 border-[#dcc373] bg-[url('/assets/img/cover-image.jpg')] bg-cover bg-center p-10">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black opacity-[0.8]"></div>
          <div className="border-b-2 border-[#dcc373] w-full relative mb-4">
            <div className="w-full h-full flex justify-center items-center py-8">
              <Image
                src="/assets/img/logo.png"
                alt="logo"
                width={300}
                height={300}
                className="object-cover"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4 w-full py-10">
              <div className="grid px-5 py-8">
                <Image
                  src="/assets/img/about.jpg"
                  alt="about"
                  width={1000}
                  height={1000}
                  className="object-cover"
                />
              </div>
              <div className="pl-8 pr-4 py-2 justify-center items-center text-center">
                <h2
                  className={`${cormorantSC.className} text-[24px] md:text-[45px] font-semibold mb-4 text-[#dcc373]`}
                >
                  Auction Your Horse
                </h2>

                <h4
                  className={`${cormorantSC.className} text-[23px] font-semibold capitalize leading-[28px] text-[#fff]`}
                >
                  All auctions will end on Tuesdays & Thursdays. We will begin
                  your listing within 24 hours of approval.
                </h4>
                <h4
                  className={`${cormorantSC.className} text-[17px] font-semibold capitalize leading-[28px] text-[#fff]  py-5`}
                >
                  WE OFFER VIDEO EDITING SERVICES FREE OF CHARGE
                </h4>

                <p
                  className={`${cormorantSC.className} text-[26px] font-semibold leading-[33px] text-[#dcc373]`}
                >
                  We are thrilled that you've chosen ClassicHorseAuction.com to
                  list your horse. We can't wait to work for you. Please note
                  that all fields must be completed below. Once submitted, we
                  will reach out to you via email or phone. Text or Call Hope @
                  615-545-6488 or Emily @ 615-542-4564 if you need any
                  assistance.
                </p>

                <p
                  className={`${cormorantSC.className} text-[16px] font-semibold leading-[33px] text-[#dcc373]  py-5`}
                >
                  <a href="/seller-terms-conditions/">
                    Please review our Seller’s Terms before submitting your
                    listing
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="relative p-14 bg-[#dcc373] shadow-lg rounded-lg mx-[20px] my-[80px]">
            <h2
              className={`${cormorantSC.className} text-[24px] md:text-[42px] font-semibold text-[#000] text-center pb-[25px]`}
            >
              Classic Horse Auction Listing Form
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              {/* EXAMPLE INPUT FIELDS */}
              <div className="flex flex-col">
                <label className={`${lora.className} text-[#000] text-[16px] pb-3`}>
                  Horse Name
                </label>
                <input
                  type="text"
                  name="horseName"
                  placeholder="Horse Name"
                  value={formData.horseName}
                  onChange={handleChange}
                  className={`border border-[#69727d] bg-white rounded-[3px] p-[.5rem_1rem] transition-all duration-300 text-[14px] ${lora.className}`}
                />
              </div>

              {/* More fields like this... */}
              <div className="flex flex-col col-span-2">
                <label className={`${lora.className} text-[#000] text-[16px] pb-3`}>
                  Address
                </label>
                <textarea
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`border border-[#69727d] bg-white rounded-[3px] p-[.5rem_1rem] transition-all duration-300 text-[14px] ${lora.className}`}
                />
              </div>

              <button
                type="submit"
                className="bg-[#0f335f] text-white p-[12px_24px] rounded-[3px] text-center transition-all duration-300 border-none text-[15px] shadow-md min-h-[40px] w-[100px] sm:w-[110px]"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
