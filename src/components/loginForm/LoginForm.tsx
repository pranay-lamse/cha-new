import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Link from "next/link";
import { toast } from "react-toastify";
import { generateSiteUrlSign } from "@/utils/generateSiteUrlSign";
import { useApolloClient } from "@apollo/client";

import client from "@/lib/apolloClient";
import axiosClient from "@/api/axiosClient";
import { env } from "@/env";
// Define the GraphQL mutation for login
const LOGIN_USER = `
  mutation LoginUser($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      authToken
      refreshToken
      user {
        id
        name
        email
      }
    }
  }
`;

export const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginerrormessage, setLoginErrorMessage] = useState<string | null>(
    null
  );
  const [loginsuccessmessage, setLoginSuccessMessage] = useState<string | null>(
    null
  );
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const decodeHtmlEntities = (text: any) => {
    const doc = new DOMParser().parseFromString(text, "text/html");
    return doc.documentElement.textContent;
  };

  useEffect(() => {
    if (loginerrormessage) {
      const timer = setTimeout(() => {
        setLoginErrorMessage("");
      }, 10000); // Hide after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [loginerrormessage]);

  useEffect(() => {
    if (loginsuccessmessage) {
      const timer = setTimeout(() => {
        setLoginSuccessMessage("");
      }, 10000); // Hide after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [loginsuccessmessage]);
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axiosClient.post("", {
        query: LOGIN_USER,
        variables: {
          username,
          password,
        },
      });

      const { data, errors } = response.data;

      if (errors) {
        throw new Error("Login failed");
      }

      if (data) {
        const { authToken, refreshToken, user } = data.login;

        const cookieOptions = { expires: 30 };

        Cookies.set("authToken", authToken, cookieOptions);
        Cookies.set("refreshToken", refreshToken, cookieOptions);
        Cookies.set("user", JSON.stringify(user), cookieOptions);

        if (rememberMe) {
          Cookies.set("rememberMe", "true", cookieOptions);
        }

        setLoginSuccessMessage(decodeHtmlEntities("Login successful"));

        window.location.reload();
      }
    } catch (error: any) {
      setLoginErrorMessage(
        decodeHtmlEntities("The username or password you entered is incorrect.")
      );
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(
        `${env.NEXT_PUBLIC_API_URL_CUSTOM_API}/wp-login.php?action=logout`,
        {
          method: "GET",
          credentials: "include", // Ensure cookies are sent
        }
      );
      // Remove authentication tokens and user info from cookies
      Cookies.remove("authToken");
      Cookies.remove("refreshToken");
      Cookies.remove("user");
      Cookies.remove("rememberMe"); // Optional, if rememberMe was set

      // Redirect the user to the login page or refresh to reset state
      /* router.push("/login"); */ // Modify if using Next.js routing
      /* window.location.reload(); */

      Cookies.remove("wordpress_logged_in_*");
      Cookies.remove("wordpress_sec_*");
    } catch (err) {
      console.error("Error logging out", err);
    }
  };

  return (
    <>
      {loginerrormessage && (
        <div className="woocommerce-notices-wrapper">
          <ul className="woocommerce-error" role="alert">
            <li>
              <strong>ERROR</strong>: The username or password you entered is
              incorrect.{" "}
              <a
                href="/my-account/lost-password/"
                title="Password Lost and Found"
              >
                Lost your password
              </a>
              ?{" "}
            </li>
          </ul>
        </div>
      )}

      {loginsuccessmessage && (
        <div className="woocommerce-notices-wrapper">
          <ul className="woocommerce-success" role="alert">
            <li>
              <div
                dangerouslySetInnerHTML={{ __html: loginsuccessmessage || "" }}
              ></div>
            </li>
          </ul>
        </div>
      )}
      <div className="u-column1 col-1">
        <h2>Login</h2>

        <form
          className="woocommerce-form woocommerce-form-login login"
          method="post"
          onSubmit={handleSubmit}
        >
          <p className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
            <label htmlFor="username">
              Username or email address
              <span className="required" aria-hidden="true">
                *
              </span>
              <span className="screen-reader-text">Required</span>
            </label>
            <input
              type="text"
              className="woocommerce-Input woocommerce-Input--text input-text"
              name="username"
              id="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              aria-required="true"
            />
          </p>

          <p className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
            <label htmlFor="password">
              Password
              <span className="required" aria-hidden="true">
                *
              </span>
              <span className="screen-reader-text">Required</span>
            </label>
            <span className="password-input">
              <input
                className="woocommerce-Input woocommerce-Input--text input-text"
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-required="true"
              />
              <span
                className="show-password-input"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </span>
          </p>

          <p className="form-row">
            <label className="woocommerce-form__label woocommerce-form__label-for-checkbox woocommerce-form-login__rememberme">
              <input
                className="woocommerce-form__input woocommerce-form__input-checkbox"
                name="rememberme"
                type="checkbox"
                id="rememberme"
                value="forever"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <span>Remember me</span>
            </label>
          </p>

          <p className="form-row">
            <button
              type="submit"
              className="woocommerce-button button woocommerce-form-login__submit"
              name="login"
              value="Log in"
              /* disabled={loading} */
            >
              Log in
            </button>
          </p>

          {/*  {error && (
          <p className="woocommerce-error">
            There was an error logging in. Please try again.
          </p>
        )} */}

          <p className="woocommerce-LostPassword lost_password">
            <Link href="/my-account/lost-password/">Lost your password?</Link>
          </p>
          <br />
          {/* <p className="woocommerce-LostPassword lost_password">
          <a className="cursor-pointer" onClick={handleLogout}>
            Logout
          </a>
        </p>
 */}
          <input type="hidden" name="redirect" value="/" />
        </form>
      </div>
    </>
  );
};
