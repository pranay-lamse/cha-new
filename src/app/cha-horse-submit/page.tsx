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
            <div className=" w-full h-full flex justify-center items-center py-8">
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
                    All auctions will end on Tuesdays & Thursdays. We will begin your listing
                    within 24 hours of approval.
                  </h4>
                  <h4
                    className={`${cormorantSC.className} text-[17px] font-semibold capitalize leading-[28px] text-[#fff]  py-5`}
                  >
                    WE OFFER VIDEO EDITING SERVICES FREE OF CHARGE 
                  </h4>

                  <p
                    className={`${cormorantSC.className} text-[26px] font-semibold leading-[33px] text-[#dcc373]`}
                  >
                    We are thrilled that you've chosen ClassicHorseAuction.com to list your
                    horse. We can't wait to work for you. Please note that all fields must be
                    completed below. Once submitted, we will reach out to you via email or phone.
                    Text or Call Hope @ 615-545-6488 or Emily @ 615-542-4564 if you need any
                    assistance.
                  </p>

                  <p className={`${cormorantSC.className} text-[16px] font-semibold leading-[33px] text-[#dcc373]  py-5`}>
                  <a href="/seller-terms-conditions/">Please review our Seller’s Terms before submitting your listing</a>
                  </p>
                
                </div>
            </div>
          </div>


        <div className="relative p-14 bg-[#dcc373] shadow-lg rounded-lg mx-[20px] my-[80px]">
  <h2 className={`${cormorantSC.className} text-[24px] md:text-[42px] font-semibold text-[#000] text-center pb-[25px]`}>
    Classic Horse Auction Listing Form
  </h2>

  <form onSubmit={handleSubmit} className="space-y-6">
    {/* First row: 3 inputs in one line */}
    <div className="flex gap-4">
      <div className="flex flex-col w-full md:w-1/3">
        <label className={`${lora.className} text-[#000] text-[16px] pb-3`}>Name</label>
        <input type="text" name="horseName" placeholder="Enter Name" value={formData.horseName} onChange={handleChange}
          className={`border border-[#69727d] bg-white rounded-[3px] p-[.5rem_1rem] transition-all duration-300 text-[14px] ${lora.className}`} />
      </div>

      <div className="flex flex-col w-full md:w-1/3">
        <label className={`${lora.className} text-[#000] text-[16px] pb-3`}>Email</label>
        <input type="text" name="email" placeholder="Enter Email" value={formData.email} onChange={handleChange}
          className={`border border-[#69727d] bg-white rounded-[3px] p-[.5rem_1rem] transition-all duration-300 text-[14px] ${lora.className}`} />
      </div>

      <div className="flex flex-col w-full md:w-1/3">
        <label className={`${lora.className} text-[#000] text-[16px] pb-3`}>Phone Number</label>
        <input type="text" name="phone" placeholder="What's Phone Number" value={formData.phone} onChange={handleChange}
          className={`border border-[#69727d] bg-white rounded-[3px] p-[.5rem_1rem] transition-all duration-300 text-[14px] ${lora.className}`} />
      </div>
    </div>

      <div className="flex flex-col">
        <label className={`${lora.className} text-[#000] text-[16px] pb-3`}>Street Address</label>
        <input type="text" name="microchipNo" placeholder="What's Your Street Address" value={formData.microchipNo} onChange={handleChange}
          className={`border border-[#69727d] bg-white rounded-[3px] p-[.5rem_1rem] text-[14px] ${lora.className}`} />
      </div>
      <div className="flex flex-col">
        <label className={`${lora.className} text-[#000] text-[16px] pb-3`}>Street Address</label>
        <input type="text" name="microchipNo" placeholder="Optional" value={formData.microchipNo} onChange={handleChange}
          className={`border border-[#69727d] bg-white rounded-[3px] p-[.5rem_1rem] text-[14px] ${lora.className}`} />
      </div>

         
    {/* Rest of the form: 2 columns */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col">
          <label className={`${lora.className} text-[#000] text-[16px] pb-3`}>City</label>
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className={`border border-[#69727d] bg-white rounded-[3px] p-[.5rem_1rem] transition-all duration-300 text-[14px] ${lora.className}`}
          />
        </div>

        <div className="flex flex-col">
          <label className={`${lora.className} text-[#000] text-[16px] pb-3`}>State</label>
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            className={`border border-[#69727d] bg-white rounded-[3px] p-[.5rem_1rem] transition-all duration-300 text-[14px] ${lora.className}`}
          />
        </div>
  
      <div className="flex flex-col">
        <label className={`${lora.className} text-[#000] text-[16px] pb-3`}>Zip/Postal Code</label>
        <input type="text" name="zip-code" placeholder="Zip/Postal Code" onChange={handleChange}
          className={`border border-[#69727d] bg-white rounded-[3px] p-[.5rem_1rem] text-[14px] ${lora.className}`} />
      </div>

      <div className="flex flex-col">
      <label htmlFor="country" className={`${lora.className} text-[#000] text-[16px] pb-3`}>Country</label>
          <select
            name="country"
            id="country"
            value={formData.country}
            onChange={handleChange}
            className={`border border-[#69727d] bg-white rounded-[3px] p-[.5rem_1rem] text-[14px] ${lora.className}`}
          >
            <option value="">Select Country</option>
            <option value="United States">United States</option>
            {/* Add more country options here if needed */}
          </select>
      </div>

      <div className="flex flex-col">
        <label className={`${lora.className} text-[#000] text-[16px] pb-3`}>Horse Name</label>
        <input type="text" name="horseName" placeholder="Your Answer" value={formData.horseName} onChange={handleChange}
          className={`border border-[#69727d] bg-white rounded-[3px] p-[.5rem_1rem] text-[14px] ${lora.className}`} />
      </div>

      <div className="flex flex-col">
        <label className={`${lora.className} text-[#000] text-[16px] pb-3`}>Breed</label>
        <input type="text" name="breed" placeholder="Your Answer" value={formData.breed} onChange={handleChange}
          className={`border border-[#69727d] bg-white rounded-[3px] p-[.5rem_1rem] text-[14px] ${lora.className}`} />
      </div>
    </div>
    <div className="flex gap-4">
      <div className="flex flex-col w-full md:w-1/3">
          <label className={`${lora.className} text-[#000] text-[16px] pb-3`}>Color</label>
          <input
            type="text"
            name="color"
            placeholder="Enter Color"
            value={formData.color}
            onChange={handleChange}
            className={`border border-[#69727d] bg-white rounded-[3px] p-[.5rem_1rem] transition-all duration-300 text-[14px] ${lora.className}`}
          />
        </div>

        {/* Height */}
        <div className="flex flex-col w-full md:w-1/3">
          <label className={`${lora.className} text-[#000] text-[16px] pb-3`}>Height</label>
          <input
            type="text"
            name="height"
            placeholder="Enter Height"
            value={formData.height}
            onChange={handleChange}
            className={`border border-[#69727d] bg-white rounded-[3px] p-[.5rem_1rem] transition-all duration-300 text-[14px] ${lora.className}`}
          />
        </div>

        {/* Parentheses */}
        <div className="flex flex-col w-full md:w-1/3">
          <label className={`${lora.className} text-[#000] text-[16px] pb-3`}>Parentheses</label>
          <input
            type="text"
            name="parentheses"
            placeholder="Enter Parentheses"
            onChange={handleChange}
            className={`border border-[#69727d] bg-white rounded-[3px] p-[.5rem_1rem] transition-all duration-300 text-[14px] ${lora.className}`}
          />
        </div>
    </div>
    <div className="flex flex-col mt-4">
      <label className={`${lora.className} text-[#000] text-[16px] pb-3`}>
        Description
      </label>
      <textarea
        name="description"
        placeholder="Enter Description"
        value={formData.description}
        onChange={handleChange}
        rows={4}
        className={`border border-[#69727d] bg-white rounded-[3px] p-[.5rem_1rem] text-[14px] resize-none ${lora.className}`}
      ></textarea>
    </div>


   <div className="flex gap-4">
  {/* Registered */}
  <div className="flex flex-col w-full md:w-1/2">
    <label className={`${lora.className} text-[#000] text-[16px] pb-3`}>Registered</label>
    <div className="flex gap-4">
      <label className="flex items-center gap-2">
        <input
          type="radio"
          name="registered"
          value="Yes"
          onChange={handleChange}
        />
        <span className={`${lora.className}`}>Yes</span>
      </label>
      <label className="flex items-center gap-2">
        <input
          type="radio"
          name="registered"
          value="No"
          onChange={handleChange}
        />
        <span className={`${lora.className}`}>No</span>
      </label>
    </div>
  </div>

  {/* Registration Number */}
  <div className="flex flex-col w-full md:w-1/2">
    <label className={`${lora.className} text-[#000] text-[16px] pb-3`}>Registration #</label>
    <input
      type="text"
      name="registrationNo"
      placeholder="Registration"
      onChange={handleChange}
      className={`border border-[#69727d] bg-white rounded-[3px] p-[.5rem_1rem] transition-all duration-300 text-[14px] ${lora.className}`}
    />
  </div>
   </div>

   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col">
          <label className={`${lora.className} text-[#000] text-[16px] pb-3`}>Height</label>
          <input
            type="text"
            name="height"
            placeholder="Your Answer"
            value={formData.height}
            onChange={handleChange}
            className={`border border-[#69727d] bg-white rounded-[3px] p-[.5rem_1rem] transition-all duration-300 text-[14px] ${lora.className}`}
          />
        </div>

        <div className="flex flex-col">
          <label className={`${lora.className} text-[#000] text-[16px] pb-3`}>Markings</label>
          <input
            type="text"
            name="markings"
            placeholder="Your Answer"
            value={formData.markings}
            onChange={handleChange}
            className={`border border-[#69727d] bg-white rounded-[3px] p-[.5rem_1rem] transition-all duration-300 text-[14px] ${lora.className}`}
          />
        </div>
        <div className="flex flex-col">
        <label className={`${lora.className} text-[#000] text-[16px] pb-3`}>Sex</label>
        <div className="flex gap-4 flex-wrap">
          {['Mare', 'Gelding', 'Stallion'].map((sexOption) => (
            <label key={sexOption} className="flex items-center gap-2">
              <input
                type="radio"
                name="sex"
                value={sexOption}
                checked={formData.sex === sexOption}
                onChange={handleChange}
              />
              <span className={`${lora.className}`}>{sexOption}</span>
            </label>
          ))}
        </div>
      </div>

        <div className="flex flex-col">
        <label className={`${lora.className} text-[#000] text-[16px] pb-1`}>
          Documents to upload (Registration Papers, Coggins, Vet Inspection)
        </label>
        <p className="text-[11px] font-semibold italic pb-2">
          Allowed: jpg, jpeg, png, gif, bmp, tiff, heic, heif, webp
        </p>
        <input
          type="file"
          name="documents"
          accept=".jpg,.jpeg,.png,.gif,.bmp,.tiff,.heic,.heif,.webp"
          multiple
          onChange={handleChange}
          className="border border-[#69727d] bg-white rounded-[3px] p-2 text-[14px]"
        />
      </div>
  
      
    </div>

 <div className="flex gap-4">
      <div className="flex flex-col w-full md:w-1/3">
        <label className={`${lora.className} text-[#000] text-[16px] pb-3`}>YouTube Links</label>
        <input type="text" name="YouTubeLinks" placeholder="Your Answer" value={formData.youtubeLinks} onChange={handleChange}
          className={`border border-[#69727d] bg-white rounded-[3px] p-[.5rem_1rem] transition-all duration-300 text-[14px] ${lora.className}`} />
      </div>

      <div className="flex flex-col w-full md:w-1/3">
        <label className={`${lora.className} text-[#000] text-[16px] pb-3`}>Location of Horse	</label>
        <input type="text" name="location" placeholder="Your Answer" value={formData.email} onChange={handleChange}
          className={`border border-[#69727d] bg-white rounded-[3px] p-[.5rem_1rem] transition-all duration-300 text-[14px] ${lora.className}`} />
      </div>

      <div className="flex flex-col w-full md:w-1/3">
        <label className={`${lora.className} text-[#000] text-[16px] pb-3`}>Buy It Now Price (optional)	</label>
        <input type="text" name="price" placeholder="Your Answer" onChange={handleChange}
          className={`border border-[#69727d] bg-white rounded-[3px] p-[.5rem_1rem] transition-all duration-300 text-[14px] ${lora.className}`} />
      </div>
    </div>

    <div className="flex flex-col">
        <label className={`${lora.className} text-[#000] text-[16px] pb-3`}>Auction Reserve Price (This is the MINIMUM price you will accept before commission)
       (NOTE that horses generate more interest once reserve price is met)</label>
        <input type="text" name="Auction" placeholder="Your Answer"
          className={`border border-[#69727d] bg-white rounded-[3px] p-[.5rem_1rem] text-[14px] ${lora.className}`} />
    </div>

      <div className="flex gap-4">
    <div className="flex flex-col w-full md:w-1/2">
      <label className={`${lora.className} text-[#000] text-[16px] pb-1`}>
        Upload Copy Of Driver License
      </label>
      <p className="text-[11px] font-semibold italic pb-2">
        Allowed: jpg, jpeg, png, gif, bmp, tiff, heic, heif, webp
      </p>
      <input
        type="file"
        name="driverLicense"
        id="driverLicense"
        accept=".jpg,.jpeg,.png,.gif,.bmp,.tiff,.heic,.heif,.webp"
        multiple
        className="border border-[#69727d] bg-white rounded-[3px] p-2 text-[14px]"
      />
    </div>

    {/* Upload Horse Photos */}
    <div className="flex flex-col w-full md:w-1/2">
      <label className={`${lora.className} text-[#000] text-[16px] pb-1`}>
        Photos Of The Horse
      </label>
      <p className="text-[11px] font-semibold italic pb-2">
        Allowed: jpg, jpeg, png, gif, bmp, tiff, heic, heif, webp
      </p>
      <input
        type="file"
        name="horsePhotos"
        id="horsePhotos"
        accept=".jpg,.jpeg,.png,.gif,.bmp,.tiff,.heic,.heif,.webp"
        multiple
        className="border border-[#69727d] bg-white rounded-[3px] p-2 text-[14px]"
      />
    </div>
  </div>

  <div className="flex gap-4">
  <div className="flex flex-col w-full md:w-1/2">
    <label className={`${lora.className} text-[#000] text-[16px] pb-3`}>
      Listing Length
    </label>
    <div className="flex gap-4">
      <label className="flex items-center gap-2">
        <input
          type="radio"
          name="listingLength"
          value="2 Weeks"
          onChange={handleChange}
        />
        <span className={`${lora.className}`}>2 Weeks</span>
      </label>
      <label className="flex items-center gap-2">
        <input
          type="radio"
          name="listingLength"
          value="3 Weeks"
          onChange={handleChange}
        />
        <span className={`${lora.className}`}>3 Weeks</span>
      </label>
    </div>
  </div>

  <div className="flex flex-col w-full md:w-1/2">
    <label className={`${lora.className} text-[#000] text-[16px] pb-3`}>
      Review <a href="https://classichorseauction.com/seller-terms-conditions/" className="text-[#0F335F] hover:underline">Seller Terms</a>
    </label>
    <div className="flex items-center">
      <input
        type="checkbox"
        name="sellerTerms"
        id="sellerTerms"
        className="mr-2"
        onChange={handleChange}
        required
      />
      <label htmlFor="sellerTerms" className={`${lora.className} text-[#000] text-[14px]`}>
        I Have Read & Agreed to Seller Terms
      </label>
    </div>
  </div>
</div>


<div className="flex flex-col w-full">
  <div className="flex flex-col w-full">
    <label className={`${lora.className} text-[#000] text-[16px] pb-3`}>
      Photo <a href="https://classichorseauction.com/seller-terms-conditions/#photo" className="text-[#0F335F] hover:underline">Consent Terms</a>
    </label>
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        name="photoConsent"
        id="photoConsent"
        className="mr-2"
        required
      />
      <label htmlFor="photoConsent" className={`${lora.className} text-[#000] text-[14px]`}>
        <em>If you did not personally take the photos you submit, you must provide written permission from the copyright holder to use them.</em>
      </label>
    </div>
  </div>
</div>



    <div className="col-span-1 md:col-span-2 flex justify-center">
      <button type="submit"
        className="bg-[#0f335f] text-white p-[12px_24px] rounded-[3px] text-center transition-all duration-300 border-none text-[15px] shadow-md min-h-[40px] w-[100px] sm:w-[110px]">
        Submit
      </button>
    </div>
  </form>
</div>

        </div>


      </div>
    </>
  );
}
