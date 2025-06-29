"use client";
import { RegisterForm } from "@/components/registerForm/RegisterForm";
import "../globals.css";
import React, { Suspense, useEffect, useState } from "react";
import { ApolloProvider } from "@apollo/client";
import client from "../../lib/apolloClient";

import { useAuth } from "../providers/UserProvider";
import Cookies from "js-cookie";
import Dashboard from "@/components/dashboard/page";
import { LoginForm } from "@/components/loginForm/LoginForm";

export default function MyAccountPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");

  const [email, setEmail] = useState("");
  const [regpassword, setRegPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsAccepted2, setTermsAccepted2] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submitted", { username, password, rememberMe });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const [loginSuccessMessage, setLoginSuccessMessage] = useState<string>("");
  const [loginErrorMessage, setLoginErrorMessage] = useState<string>("");

  const { user, loading, isAuthenticated } = useAuth();
  console.log("user", user);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    country: "US",
    streetAddress: "",
    apartment: "",
    city: "",
    state: "TN",
    postcode: "",
    phone: "",
  });

  useEffect(() => {
    const message = localStorage.getItem("loginMessage");
    if (message) {
      setLoginMessage(message);
      localStorage.removeItem("loginMessage");
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target; // 'value' will be available because of the cast
    setFormData({
      ...formData,
      [name]: value, // Update the correct field dynamically
    });
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ApolloProvider client={client}>
        <div className="container  mx-auto w-full sm:w-11/12 lg:w-[1140px] px-4 md:px-0">
          <div className="e-my-account-tab e-my-account-tab__dashboard w-full p-2">
            <div className="woocommerce my-account-mobile">
              <div className="woocommerce-notices-wrapper">
                {loginErrorMessage && (
                  <div className="woocommerce-notices-wrapper">
                    <ul className="woocommerce-error" role="alert">
                      <li>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: loginErrorMessage || "",
                          }}
                        ></div>
                      </li>
                    </ul>
                  </div>
                )}

                {loginMessage && (
                  <div className="woocommerce-notices-wrapper">
                    <ul className="woocommerce-error" role="alert">
                      <li>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: loginMessage || "",
                          }}
                        ></div>
                      </li>
                    </ul>
                  </div>
                )}

                {loginSuccessMessage && (
                  <div className="woocommerce-notices-wrapper">
                    <ul className="woocommerce-success" role="alert">
                      <li>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: loginSuccessMessage || "",
                          }}
                        ></div>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {loading || isAuthenticated === null ? ( // Ensure loading or undefined auth state is handled
                <div className="flex justify-center items-center min-h-[300px]">
                  <p>Loading...</p>
                </div>
              ) : isAuthenticated ? (
                <Dashboard />
              ) : (
                <div className="u-columns col2-set" id="customer_login">
                  <LoginForm
                    setLoginErrorMessage={setLoginErrorMessage}
                    setLoginSuccessMessage={setLoginSuccessMessage}
                  />
                  <RegisterForm
                    setLoginErrorMessage={setLoginErrorMessage}
                    setLoginSuccessMessage={setLoginSuccessMessage}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </ApolloProvider>
    </Suspense>
  );
}
