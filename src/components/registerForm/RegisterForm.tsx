import { useEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { toast } from "react-toastify";
import StripePayment from "../CheckoutForm";
import Link from "next/link";
import { updateAddress } from "@/lib/updateAddress";
import { updateAddresscreate } from "@/lib/address";

// Define the GraphQL mutation for registration
const REGISTER_USER = gql`
  mutation RegisterUser(
    $username: String!
    $password: String!
    $email: String!
    $firstName: String!
    $lastName: String!
    $displayName: String!
  ) {
    registerUser(
      input: {
        username: $username
        password: $password
        email: $email
        firstName: $firstName
        lastName: $lastName
        displayName: $displayName
      }
    ) {
      user {
        userId
        id
        name
        email
      }
    }
  }
`;

export const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [errormessage, setErrorMessage] = useState<string | null>(null);
  const [successmessage, setSuccessMessage] = useState<string | null>(null);
  const [registerUser, { data, loading, error }] = useMutation(REGISTER_USER);
  const decodeHtmlEntities = (text: any) => {
    const doc = new DOMParser().parseFromString(text, "text/html");
    return doc.documentElement.textContent;
  };

  /* new logic for address

  */

  const [countries, setCountries] = useState<{ name: string; code: string }[]>(
    []
  );
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
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  /*  const handleSubmitaddress = async (e: React.FormEvent<HTMLFormElement>) => {
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
  }; */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Dynamically updates the corresponding field
    }));
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (errormessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 10000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [errormessage]);

  useEffect(() => {
    if (successmessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 10000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [successmessage]);

  /* end */
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await registerUser({
        variables: {
          username,
          password,
          email,
          firstName,
          lastName,
          displayName,
        },
      });

      if (response.data.registerUser.user) {
        setSuccessMessage(decodeHtmlEntities("Registration Successful"));
        formRef.current?.reset(); // Reset the form fields

        setUsername("");
        setPassword("");
        setEmail("");
        setFirstName("");
        setLastName("");
        setDisplayName("");

        const formattedData: Record<string, string> = {};

        // Format the data as required
        for (const key in formData) {
          if (formData.hasOwnProperty(key)) {
            // Convert camelCase keys to snake_case keys with underscores
            const formattedKey = key
              .replace(/([A-Z])/g, "_$1") // Add underscore before uppercase letters
              .toLowerCase(); // Convert to lowercase
            formattedData[formattedKey] =
              formData[key as keyof typeof formData];
          }
        }

        // Add user ID to the payload
        formattedData["id"] = response.data.registerUser.user.userId; // Replace with dynamic ID if needed

        console.log("Formatted data to submit:", formattedData); // For debugging

        try {
          const responseagain = await updateAddresscreate(
            "/wp-json/custom/v1/update-billing",
            formattedData
          );
        } catch (updateError) {
          console.warn("Address update failed:", updateError);
          // Optionally show a non-blocking message
          // setErrorMessage("Partial success: registration done, but address update failed.");
        }
        setFormData({
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
      } // Reset form data after submission
    } catch (err: any) {
      console.error("Error registering user", err);
      /* alert(err.message) */
      setErrorMessage(decodeHtmlEntities(err.message));
      /* toast.error(err.message); */
    }
  };

  return (
    <>
      {errormessage && (
        <div className="woocommerce-notices-wrapper">
          <ul className="woocommerce-error" role="alert">
            <li>
              <div
                dangerouslySetInnerHTML={{ __html: errormessage || "" }}
              ></div>
            </li>
          </ul>
        </div>
      )}
      {successmessage && (
        <div className="woocommerce-notices-wrapper">
          <ul className="woocommerce-success" role="alert">
            <li>
              <div
                dangerouslySetInnerHTML={{ __html: successmessage || "" }}
              ></div>
            </li>
          </ul>
        </div>
      )}
      <div className="u-column2 col-2 mt-4 sm:mt-0">
        <h2>Register</h2>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="woocommerce-form woocommerce-form-register register"
        >
          <p className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
            <label htmlFor="reg_username">
              Username&nbsp;
              <span className="required" aria-hidden="true">
                *
              </span>
            </label>
            <input
              type="text"
              className="woocommerce-Input woocommerce-Input--text input-text"
              name="username"
              id="reg_username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </p>
          <p className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
            <label htmlFor="reg_email">
              Email address&nbsp;
              <span className="required" aria-hidden="true">
                *
              </span>
            </label>
            <input
              type="email"
              className="woocommerce-Input woocommerce-Input--text input-text"
              name="email"
              id="reg_email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </p>
          <p className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
            <label htmlFor="reg_password">
              Password&nbsp;
              <span className="required" aria-hidden="true">
                *
              </span>
            </label>
            <input
              type="password"
              className="woocommerce-Input woocommerce-Input--text input-text"
              name="password"
              id="reg_password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </p>
          <StripePayment /> <br />
          <strong> Billing details </strong> <br />
          <p className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
            <label htmlFor="firstName">
              First Name&nbsp;
              <span className="required" aria-hidden="true">
                *
              </span>
            </label>
            <input
              type="text"
              className="woocommerce-Input woocommerce-Input--text input-text"
              name="firstName"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </p>
          <p className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
            <label htmlFor="lastName">
              Last Name&nbsp;
              <span className="required" aria-hidden="true">
                *
              </span>
            </label>
            <input
              type="text"
              className="woocommerce-Input woocommerce-Input--text input-text"
              name="lastName"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </p>
          <p className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
            <label htmlFor="company">
              Company name (optional)&nbsp;
              {/*   <span className="required" aria-hidden="true">
              *
            </span> */}
            </label>
            <input
              type="text"
              className="woocommerce-Input woocommerce-Input--text input-text"
              name="company"
              id="company"
              value={formData.company}
              onChange={handleChange}
            />
          </p>
          <p className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
            <label htmlFor="componay_name">
              Country / Region &nbsp;
              <span className="required" aria-hidden="true">
                *
              </span>
              <select
                className="woocommerce-Input woocommerce-Input--select input-select"
                name="country"
                id="country"
                value={formData.country} // ✅ Correct way to set the selected option
                onChange={handleChange} // ✅ Handle changes dynamically
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
            </label>
          </p>
          <p className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
            <label htmlFor="address1">
              Street address &nbsp;
              <span className="required" aria-hidden="true">
                *
              </span>
            </label>
            <input
              type="text"
              className="woocommerce-Input woocommerce-Input--text input-text"
              name="address1"
              id="address1"
              value={formData.address1}
              onChange={handleChange}
              required
            />
          </p>
          <p className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
            <label htmlFor="city">
              Town / City &nbsp;
              <span className="required" aria-hidden="true">
                *
              </span>
            </label>
            <input
              type="text"
              className="woocommerce-Input woocommerce-Input--text input-text"
              name="city"
              id="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </p>
          <p className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
            <label htmlFor="componay_name">
              State &nbsp;
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
              value={formData?.state} // ✅ Correct way to manage selected option
            >
              <option value="">Select a state</option>
              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </p>
          <p className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
            <label htmlFor="postcode">
              ZIP Code &nbsp;
              <span className="required" aria-hidden="true">
                *
              </span>
            </label>
            <input
              type="text"
              className="woocommerce-Input woocommerce-Input--text input-text"
              name="postcode"
              id="postcode"
              value={formData.postcode}
              onChange={handleChange}
            />
          </p>
          <p className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
            <label htmlFor="phone">
              Phone &nbsp;
              <span className="required" aria-hidden="true">
                *
              </span>
            </label>
            <input
              type="text"
              className="woocommerce-Input woocommerce-Input--text input-text"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </p>
          <p>
            Your personal data will be used to support your experience
            throughout this website, to manage access to your account, and for
            other purposes described in our
            <Link href="/privacy-policy"> Privacy Policy</Link>
          </p>
          <p className="form-row form-row-wide">
            <button
              type="submit"
              className="woocommerce-Button woocommerce-button button woocommerce-form-register__submit cursor-pointer"
              name="register"
              value="Register"
              disabled={loading}
            >
              Register
            </button>
          </p>
        </form>
      </div>
    </>
  );
};
