import { useEffect, useState } from "react";

import { useRouter } from "next/navigation"; //
import Cookies from "js-cookie";
import Link from "next/link";

import axiosClient from "@/api/axiosClient";
import { env } from "@/env";
import { useSearchParams } from "next/navigation";
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

interface LoginFormProps {
  setLoginSuccessMessage: (msg: string) => void;
  setLoginErrorMessage: (msg: string) => void;
}
export const LoginForm: React.FC<LoginFormProps> = ({
  setLoginSuccessMessage,
  setLoginErrorMessage,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirect");
const redirectTo =  rawRedirect && rawRedirect.trim() !== "" ? decodeURIComponent(rawRedirect) : "/my-account";
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setLoginErrorMessage("");
    setLoginSuccessMessage("");

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

        setLoginSuccessMessage("Login successful");

      window.location.href = redirectTo;
      }
    } catch (error: any) {
      setLoginErrorMessage(
        "The username or password you entered is incorrect."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
              disabled={loading}
            >
              {loading ? <span className="spinner"></span> : "Log in"}
            </button>
          </p>

          <p className="woocommerce-LostPassword lost_password">
            <Link href="/my-account/lost-password/">Lost your password?</Link>
          </p>
          <br />

          <input type="hidden" name="redirect" value="/" />
        </form>
      </div>
    </>
  );
};
