"use client";
import React, { useEffect, useState } from "react";

import MenuPage from "@/components/my-account-menu/page";
import Loader from "@/components/Loader";

import axiosClient from "@/api/axiosClient";
import { GET_ADDRESS_DETAILS } from "@/graphql/queries/getAddress";

import { useAuth } from "@/app/providers/UserProvider";
import { updateAddress } from "@/lib/updateAddress";

export default function EditAccountPage() {
  const { user, isAuthenticated } = useAuth(); // ✅ Access user data

  const [countries, setCountries] = useState<{ name: string; code: string }[]>(
    []
  );
  const [billing, setBilling] = useState<any>(null);
  const [shipping, setShipping] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState([
    { id: "AL", name: "Alabama" },
    { id: "AK", name: "Alaska" },
    { id: "AZ", name: "Arizona" },
    { id: "AR", name: "Arkansas" },
    { id: "CA", name: "California" },
    { id: "CO", name: "Colorado" },
    { id: "CT", name: "Connecticut" },
    { id: "DE", name: "Delaware" },
    { id: "FL", name: "Florida" },
    { id: "GA", name: "Georgia" },
    { id: "HI", name: "Hawaii" },
    { id: "ID", name: "Idaho" },
    { id: "IL", name: "Illinois" },
    { id: "IN", name: "Indiana" },
    { id: "IA", name: "Iowa" },
    { id: "KS", name: "Kansas" },
    { id: "KY", name: "Kentucky" },
    { id: "LA", name: "Louisiana" },
    { id: "ME", name: "Maine" },
    { id: "MD", name: "Maryland" },
    { id: "MA", name: "Massachusetts" },
    { id: "MI", name: "Michigan" },
    { id: "MN", name: "Minnesota" },
    { id: "MS", name: "Mississippi" },
    { id: "MO", name: "Missouri" },
    { id: "MT", name: "Montana" },
    { id: "NE", name: "Nebraska" },
    { id: "NV", name: "Nevada" },
    { id: "NH", name: "New Hampshire" },
    { id: "NJ", name: "New Jersey" },
    { id: "NM", name: "New Mexico" },
    { id: "NY", name: "New York" },
    { id: "NC", name: "North Carolina" },
    { id: "ND", name: "North Dakota" },
    { id: "OH", name: "Ohio" },
    { id: "OK", name: "Oklahoma" },
    { id: "OR", name: "Oregon" },
    { id: "PA", name: "Pennsylvania" },
    { id: "RI", name: "Rhode Island" },
    { id: "SC", name: "South Carolina" },
    { id: "SD", name: "South Dakota" },
    { id: "TN", name: "Tennessee" },
    { id: "TX", name: "Texas" },
    { id: "UT", name: "Utah" },
    { id: "VT", name: "Vermont" },
    { id: "VA", name: "Virginia" },
    { id: "WA", name: "Washington" },
    { id: "WV", name: "West Virginia" },
    { id: "WI", name: "Wisconsin" },
    { id: "WY", name: "Wyoming" },
  ]);

  const [selectedState, setSelectedState] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    country: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postcode: "",
    phone: "",
    email: "",
  });

  /* useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchHtmlData(url); // ✅ Pass URL dynamically
        setHtmlContent(data);
      } catch (error) {
        setError("Failed to fetch data. Please try again later.");
        setHtmlContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); */

  const handleRemoveClick = async (auctionId: string) => {
    return 1;
  };

  useEffect(() => {
    const fetchAddress = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.post("", {
          query: GET_ADDRESS_DETAILS,
        });

        const customerData = response.data?.data?.customer;
        setBilling(customerData?.billing || null);
        setShipping(customerData?.shipping || null);
        setFormData(customerData?.billing || null);
      } catch (error) {
        console.error("Error fetching address:", error);
        setBilling(null);
        setShipping(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Dynamically updates the corresponding field
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formattedData: Record<string, string> = {};

    // Format the data as required
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        // Convert camelCase keys to snake_case keys with underscores
        const formattedKey = key
          .replace(/([A-Z])/g, "_$1") // Add underscore before uppercase letters
          .toLowerCase(); // Convert to lowercase
        formattedData[formattedKey] = formData[key as keyof typeof formData];
      }
    }

    // Add user ID to the payload
    formattedData["id"] = user?.userId; // Replace with dynamic ID if needed

    console.log("Formatted data to submit:", formattedData); // For debugging

    const response = await updateAddress(
      "/wp-json/custom/v1/update-billing",
      formattedData
    );
    if (response) {
      alert("Address updated successfully!");
      window.location.reload(); // Reload the page to reflect changes
    } else {
      alert("Failed to update address. Please try again.");
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all");
      const data = await response.json();
      const countryList = data.map(
        (country: { name: { common: string }; cca2: string }) => ({
          name: country.name.common,
          code: country.cca2,
        })
      );

      // Sort countries alphabetically
      countryList.sort((a: { name: string }, b: { name: string }) =>
        a.name.localeCompare(b.name)
      );

      setCountries(countryList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching countries:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);
  return (
    <div className="container  mx-auto w-full sm:w-11/12 lg:w-[1170px] px-2">
      <div className="e-my-account-tab e-my-account-tab__dashboard">
        <div className="woocommerce myaccount-info">
          <div className="woocommerce-MyAccount-navigation col-span-1">
            <MenuPage />
          </div>
          <div className="woocommerce-MyAccount-content-outer">
            {loading ? (
              <Loader />
            ) : (
              <>
                <h2 className="text-[24px] sm:text-[45px] font-[500] font-[Marcellus] text-[#000] leading-[1.2] py-6">
                  Billing address
                </h2>
                <div className="woocommerce">
                  <form
                    onSubmit={handleSubmit}
                    className="woocommerce-form woocommerce-form-register register"
                  >
                    <div className="w-full flex flex-col md:flex-row gap-4">
                      <p className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide w-full md:w-1/2">
                        <label htmlFor="firstName">
                          First name&nbsp;
                          <span className="required" aria-hidden="true">
                            *
                          </span>
                        </label>
                        <input
                          type="text"
                          className="woocommerce-Input woocommerce-Input--text input-text"
                          name="firstName"
                          id="firstName"
                          value={formData?.firstName}
                          onChange={handleChange}
                          required
                        />
                      </p>
                      <p className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide w-full md:w-1/2">
                        <label htmlFor="lastName">
                          Last name&nbsp;
                          <span className="required" aria-hidden="true">
                            *
                          </span>
                        </label>
                        <input
                          type="text"
                          className="woocommerce-Input woocommerce-Input--text input-text"
                          name="lastName"
                          id="lastName"
                          value={formData?.lastName}
                          onChange={handleChange}
                          required
                        />
                      </p>
                    </div>

                    <p className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
                      <label htmlFor="company">
                        Company name (optional)&nbsp;
                      </label>
                      <input
                        type="text"
                        className="woocommerce-Input woocommerce-Input--text input-text"
                        name="company"
                        value={formData?.company}
                        onChange={handleChange}
                        id="company"
                      />
                    </p>

                    <p className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
                      <label htmlFor="country">
                        Country / Region&nbsp;
                        <span className="required" aria-hidden="true">
                          *
                        </span>
                      </label>
                      <select
                        className="woocommerce-Input woocommerce-Input--select input-select"
                        name="country"
                        id="country"
                        value={formData.country} // ✅ Correct way to set the selected option
                        onChange={handleChange} // ✅ Handle changes dynamically
                        required
                      >
                        <option value="">Select country</option>
                        {loading ? (
                          <option disabled>Loading...</option>
                        ) : (
                          countries.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.name.toLowerCase()}
                            </option>
                          ))
                        )}
                      </select>
                    </p>

                    <p className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
                      <label htmlFor="address1">
                        Street address&nbsp;
                        <span className="required" aria-hidden="true">
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        className="woocommerce-Input woocommerce-Input--text input-text"
                        name="address1"
                        id="address1"
                        value={formData?.address1}
                        onChange={handleChange}
                        required
                      />
                      <input
                        type="text"
                        className="woocommerce-Input woocommerce-Input--text input-text mt-2 extra-input"
                        placeholder="Apartment, suite, unit, etc. (optional)"
                        name="address2"
                        id="address2"
                        onChange={handleChange}
                        value={formData?.address2}
                      />
                    </p>

                    <p className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
                      <label htmlFor="city">
                        Town / City&nbsp;
                        <span className="required" aria-hidden="true">
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        className="woocommerce-Input woocommerce-Input--text input-text"
                        name="city"
                        id="city"
                        onChange={handleChange}
                        value={formData?.city}
                        required
                      />
                    </p>

                    <p className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
                      <label htmlFor="state">
                        State&nbsp;
                        <span className="required" aria-hidden="true">
                          *
                        </span>
                      </label>
                      <select
                        className="woocommerce-Input woocommerce-Input--select input-select"
                        name="state"
                        id="state"
                        required
                        onChange={handleChange}
                        value={formData?.state} // ✅ Correct way to set the selected option
                      >
                        <option value="">Select a state</option>
                        {states.map((state) => (
                          <option
                            key={state.id}
                            value={formData.state}
                            selected={billing?.state === state.id}
                          >
                            {state.name}
                          </option>
                        ))}
                      </select>
                    </p>

                    <p className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
                      <label htmlFor="postcode">
                        ZIP Code&nbsp;
                        <span className="required" aria-hidden="true">
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        className="woocommerce-Input woocommerce-Input--text input-text"
                        name="postcode"
                        id="postcode"
                        value={formData?.postcode}
                        required
                      />
                    </p>

                    <p className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
                      <label htmlFor="phone">
                        Phone&nbsp;
                        <span className="required" aria-hidden="true">
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        className="woocommerce-Input woocommerce-Input--text input-text"
                        name="phone"
                        id="phone"
                        onChange={handleChange}
                        value={formData?.phone}
                        required
                      />
                    </p>

                    <p className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
                      <label htmlFor="email">
                        Email address&nbsp;
                        <span className="required" aria-hidden="true">
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        className="woocommerce-Input woocommerce-Input--text input-text"
                        name="email"
                        id="email"
                        onChange={handleChange}
                        value={formData?.email}
                        required
                      />
                    </p>

                    <p className="form-row form-row-wide">
                      <button
                        type="submit"
                        className="woocommerce-Button woocommerce-button button woocommerce-form-register__submit"
                        name="register"
                        value="Register"
                      >
                        Save address
                      </button>
                    </p>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
