"use client";
import { RegisterForm } from "@/components/registerForm/RegisterForm";
import "../globals.css";
import React, { useEffect, useState } from "react";
import { ApolloProvider } from "@apollo/client";
import client from "../../lib/apolloClient";
import { LoginForm } from "@/components/loginForm/LoginForm";
import { useAuth } from "../providers/UserProvider";
import Cookies from "js-cookie";
import Dashboard from "@/components/dashboard/page";

export default function MyAccountPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target; // 'value' will be available because of the cast
    setFormData({
      ...formData,
      [name]: value, // Update the correct field dynamically
    });
  };

  useEffect(() => {
    if (loginSuccessMessage) {
      const timer = setTimeout(() => {
        setLoginSuccessMessage("");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [loginSuccessMessage]);
  useEffect(() => {
    if (loginErrorMessage) {
      const timer = setTimeout(() => {
        setLoginErrorMessage("");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [loginErrorMessage]);

  return (
    <ApolloProvider client={client}>
      <div className="container  mx-auto w-full sm:w-11/12 lg:w-[1140px] px-4 md:px-0">
        <div className="e-my-account-tab e-my-account-tab__dashboard w-full p-2">
          <div className="woocommerce my-account-mobile">
            <div className="woocommerce-notices-wrapper"></div>
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
  );
}
