"use client";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

// GraphQL mutation for resetting password
const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($username: String!) {
    resetPassword(input: { username: $username }) {
      message
      success
    }
  }
`;

const ResetPasswordForm = () => {
  const [username, setUsername] = useState("");
  const [resetPassword, { data, loading, error }] = useMutation(
    RESET_PASSWORD_MUTATION
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await resetPassword({
        variables: { username },
      });

      if (response.data.resetPassword.success) {
        alert(response.data.resetPassword.message);
      } else {
        alert("Error resetting password. Please try again.");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="woocommerce container mx-auto w-full sm:w-11/12 lg:w-[1140px] my-10 sm:my-10 px-4 md:px-0 password-lost">
      <div className="woocommerce-notices-wrapper"></div>
      <form
        method="post"
        className="woocommerce-ResetPassword lost_reset_password p-2"
        onSubmit={handleSubmit}
      >
        <p>
          Lost your password? Please enter your username or email address. You
          will receive a link to create a new password via email.
        </p>
        <p className="woocommerce-form-row woocommerce-form-row--first form-row form-row-first">
          <label htmlFor="user_login">
            Username or email&nbsp;
            <span className="required" aria-hidden="true">
              *
            </span>
            <span className="screen-reader-text">Required</span>
          </label>
          <input
            className="woocommerce-Input woocommerce-Input--text input-text"
            type="text"
            name="user_login"
            id="user_login"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            aria-required="true"
          />
        </p>
        <div className="clear"></div>
        <p className="woocommerce-form-row form-row">
          <input type="hidden" name="wc_reset_password" value="true" />
          <button
            type="submit"
            className="woocommerce-Button button"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </p>
        {error && (
          <p className="woocommerce-error">
            There was an error resetting your password. Please try again.
          </p>
        )}
        {data && !data.resetPassword.success && (
          <p className="woocommerce-error">
            Error: {data.resetPassword.message}
          </p>
        )}
        <input
          type="hidden"
          name="_wp_http_referer"
          value="/my-account/lost-password/"
        />
      </form>
    </div>
  );
};

export default ResetPasswordForm;
