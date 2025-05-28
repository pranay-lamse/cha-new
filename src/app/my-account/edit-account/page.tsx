"use client";
import React, { useEffect, useState } from "react";
import { lora, cormorantSC } from "@/config/fonts";
import MenuPage from "@/components/my-account-menu/page";
import axiosClientGeneralToken from "@/api/axiosClientGeneralToken";
import {
  GET_USER_DETAILS,
  UPDATE_PASSWORD,
  UPDATE_USER_PROFILE,
} from "@/graphql/queries/getUserDetails";
import Loader from "@/components/Loader";
import axiosClient from "@/api/axiosClient";
import { useAuth } from "@/app/providers/UserProvider";

export default function EditAccountPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.post("", {
          query: GET_USER_DETAILS,
          variables: { first: 20 },
        });

        const customer = response.data?.data?.customer;
        if (customer) {
          setFirstName(customer.firstName);

          setLastName(customer.lastName);
          setDisplayName(customer.displayName);
          setEmail(customer.email);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match!");
      return;
    }

    try {
      const response = await axiosClient.post("", {
        query: UPDATE_PASSWORD,
        variables: {
          id: user?.userId, // <-- Use the correct user ID here
          password: newPassword, // <-- Use `password` instead of `newPassword`
        },
      });

      const response2 = await axiosClient.post("", {
        query: UPDATE_USER_PROFILE, // Define this mutation as above
        variables: {
          id: user?.userId,
          firstName,
          lastName,
          displayName,
          email,
        },
      });

      if (response.data?.data?.updateUser?.user) {
        setPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        alert("Error updating password");
      }
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  return (
    <div className="container mx-auto w-full sm:w-11/12 lg:w-[1170px] my-10 sm:my-20 px-3 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 myaccount-info">
        <div className="col-span-1">
          <MenuPage />
        </div>
        <div className="col-span-1 md:col-span-3 md:pl-[60px]">
          {loading ? (
            <Loader />
          ) : (
            <div className="u-columns col2-set" id="customer_login">
              <div className="woocommerce p-[16px] px-[20px] sm:px-[30px] border border-[#d5d8dc] rounded-[3px]">
                <form
                  onSubmit={handlePasswordUpdate}
                  className="woocommerce-form woocommerce-form-register account-info"
                >
                  <div className="w-full flex flex-col md:flex-row gap-4">
                    <p className="form-row w-full md:w-1/2">
                      <label htmlFor="first-name">
                        First name{" "}
                        <span
                          className="required text-[#a00] font-bold"
                          aria-hidden="true"
                        >
                          *
                        </span>{" "}
                      </label>
                      <input
                        type="text"
                        id="first-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </p>
                    <p className="form-row w-full md:w-1/2">
                      <label htmlFor="last-name">
                        Last name{" "}
                        <span
                          className="required text-[#a00] font-bold"
                          aria-hidden="true"
                        >
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        id="last-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </p>
                  </div>

                  <p className="form-row">
                    <label htmlFor="display-name">
                      Display name{" "}
                      <span
                        className="required text-[#a00] font-bold"
                        aria-hidden="true"
                      >
                        *
                      </span>
                    </label>
                    <input
                      type="text"
                      id="display-name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                    />
                  </p>

                  <p className="form-row">
                    <label htmlFor="email">
                      Email address{" "}
                      <span
                        className="required text-[#a00] font-bold"
                        aria-hidden="true"
                      >
                        *
                      </span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </p>

                  <h3
                    className={`${lora.className} text-[14px] font-medium text-black py-4`}
                  >
                    Password change
                  </h3>

                  <p className="form-row">
                    <label htmlFor="password">Current password </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </p>

                  <p className="form-row">
                    <label htmlFor="new-password">New password </label>
                    <input
                      type="password"
                      id="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </p>

                  <p className="form-row">
                    <label htmlFor="confirm-new-password">
                      Confirm new password{" "}
                    </label>
                    <input
                      type="password"
                      id="confirm-new-password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                  </p>

                  <p className="form-row">
                    <button
                      type="submit"
                      className="mt-5 border border-[#dac172] bg-[#dac172] text-white text-[14px] px-[28px] py-[14px] w-auto h-auto text-center rounded-none transition-all duration-300 ease-in-out shadow-none leading-[1.1em] font-raleway hover:bg-transparent hover:border-[#dac172] hover:text-[#dac172]"
                    >
                      Save changes
                    </button>
                  </p>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
