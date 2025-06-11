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
interface RegisterFormProps {
  setLoginSuccessMessage: (msg: string) => void;
  setLoginErrorMessage: (msg: string) => void;
}
export const RegisterForm: React.FC<RegisterFormProps> = ({
  setLoginSuccessMessage,
  setLoginErrorMessage,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");

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
  const [isRegistering, setIsRegistering] = useState(false);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Dynamically updates the corresponding field
    }));
  };

  /* end */
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsRegistering(true);
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
        setLoginSuccessMessage(
          "Registration Successfully! You can now log in."
        );
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
        formattedData["email"] = email; // Replace with dynamic ID if needed

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

      setLoginErrorMessage("Registration failed. Please try again.");
      /* toast.error(err.message); */
    } finally {
      setIsRegistering(false);
      const noticeWrapper = document.querySelector("body");
      if (noticeWrapper) {
        noticeWrapper.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        console.log("Element not found");
      }
    }
  };

  return (
    <>
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
                <option value="AF">afghanistan</option>
                <option value="AX">åland islands</option>
                <option value="AL">albania</option>
                <option value="DZ">algeria</option>
                <option value="AS">american samoa</option>
                <option value="AD">andorra</option>
                <option value="AO">angola</option>
                <option value="AI">anguilla</option>
                <option value="AQ">antarctica</option>
                <option value="AG">antigua and barbuda</option>
                <option value="AR">argentina</option>
                <option value="AM">armenia</option>
                <option value="AW">aruba</option>
                <option value="AU">australia</option>
                <option value="AT">austria</option>
                <option value="AZ">azerbaijan</option>
                <option value="BS">bahamas</option>
                <option value="BH">bahrain</option>
                <option value="BD">bangladesh</option>
                <option value="BB">barbados</option>
                <option value="BY">belarus</option>
                <option value="BE">belgium</option>
                <option value="BZ">belize</option>
                <option value="BJ">benin</option>
                <option value="BM">bermuda</option>
                <option value="BT">bhutan</option>
                <option value="BO">bolivia</option>
                <option value="BA">bosnia and herzegovina</option>
                <option value="BW">botswana</option>
                <option value="BV">bouvet island</option>
                <option value="BR">brazil</option>
                <option value="IO">british indian ocean territory</option>
                <option value="VG">british virgin islands</option>
                <option value="BN">brunei</option>
                <option value="BG">bulgaria</option>
                <option value="BF">burkina faso</option>
                <option value="BI">burundi</option>
                <option value="KH">cambodia</option>
                <option value="CM">cameroon</option>
                <option value="CA">canada</option>
                <option value="CV">cape verde</option>
                <option value="BQ">caribbean netherlands</option>
                <option value="KY">cayman islands</option>
                <option value="CF">central african republic</option>
                <option value="TD">chad</option>
                <option value="CL">chile</option>
                <option value="CN">china</option>
                <option value="CX">christmas island</option>
                <option value="CC">cocos (keeling) islands</option>
                <option value="CO">colombia</option>
                <option value="KM">comoros</option>
                <option value="CK">cook islands</option>
                <option value="CR">costa rica</option>
                <option value="HR">croatia</option>
                <option value="CU">cuba</option>
                <option value="CW">curaçao</option>
                <option value="CY">cyprus</option>
                <option value="CZ">czechia</option>
                <option value="DK">denmark</option>
                <option value="DJ">djibouti</option>
                <option value="DM">dominica</option>
                <option value="DO">dominican republic</option>
                <option value="CD">dr congo</option>
                <option value="EC">ecuador</option>
                <option value="EG">egypt</option>
                <option value="SV">el salvador</option>
                <option value="GQ">equatorial guinea</option>
                <option value="ER">eritrea</option>
                <option value="EE">estonia</option>
                <option value="SZ">eswatini</option>
                <option value="ET">ethiopia</option>
                <option value="FK">falkland islands</option>
                <option value="FO">faroe islands</option>
                <option value="FJ">fiji</option>
                <option value="FI">finland</option>
                <option value="FR">france</option>
                <option value="GF">french guiana</option>
                <option value="PF">french polynesia</option>
                <option value="TF">french southern and antarctic lands</option>
                <option value="GA">gabon</option>
                <option value="GM">gambia</option>
                <option value="GE">georgia</option>
                <option value="DE">germany</option>
                <option value="GH">ghana</option>
                <option value="GI">gibraltar</option>
                <option value="GR">greece</option>
                <option value="GL">greenland</option>
                <option value="GD">grenada</option>
                <option value="GP">guadeloupe</option>
                <option value="GU">guam</option>
                <option value="GT">guatemala</option>
                <option value="GG">guernsey</option>
                <option value="GN">guinea</option>
                <option value="GW">guinea-bissau</option>
                <option value="GY">guyana</option>
                <option value="HT">haiti</option>
                <option value="HM">heard island and mcdonald islands</option>
                <option value="HN">honduras</option>
                <option value="HK">hong kong</option>
                <option value="HU">hungary</option>
                <option value="IS">iceland</option>
                <option value="IN">india</option>
                <option value="ID">indonesia</option>
                <option value="IR">iran</option>
                <option value="IQ">iraq</option>
                <option value="IE">ireland</option>
                <option value="IM">isle of man</option>
                <option value="IL">israel</option>
                <option value="IT">italy</option>
                <option value="CI">ivory coast</option>
                <option value="JM">jamaica</option>
                <option value="JP">japan</option>
                <option value="JE">jersey</option>
                <option value="JO">jordan</option>
                <option value="KZ">kazakhstan</option>
                <option value="KE">kenya</option>
                <option value="KI">kiribati</option>
                <option value="XK">kosovo</option>
                <option value="KW">kuwait</option>
                <option value="KG">kyrgyzstan</option>
                <option value="LA">laos</option>
                <option value="LV">latvia</option>
                <option value="LB">lebanon</option>
                <option value="LS">lesotho</option>
                <option value="LR">liberia</option>
                <option value="LY">libya</option>
                <option value="LI">liechtenstein</option>
                <option value="LT">lithuania</option>
                <option value="LU">luxembourg</option>
                <option value="MO">macau</option>
                <option value="MG">madagascar</option>
                <option value="MW">malawi</option>
                <option value="MY">malaysia</option>
                <option value="MV">maldives</option>
                <option value="ML">mali</option>
                <option value="MT">malta</option>
                <option value="MH">marshall islands</option>
                <option value="MQ">martinique</option>
                <option value="MR">mauritania</option>
                <option value="MU">mauritius</option>
                <option value="YT">mayotte</option>
                <option value="MX">mexico</option>
                <option value="FM">micronesia</option>
                <option value="MD">moldova</option>
                <option value="MC">monaco</option>
                <option value="MN">mongolia</option>
                <option value="ME">montenegro</option>
                <option value="MS">montserrat</option>
                <option value="MA">morocco</option>
                <option value="MZ">mozambique</option>
                <option value="MM">myanmar</option>
                <option value="NA">namibia</option>
                <option value="NR">nauru</option>
                <option value="NP">nepal</option>
                <option value="NL">netherlands</option>
                <option value="NC">new caledonia</option>
                <option value="NZ">new zealand</option>
                <option value="NI">nicaragua</option>
                <option value="NE">niger</option>
                <option value="NG">nigeria</option>
                <option value="NU">niue</option>
                <option value="NF">norfolk island</option>
                <option value="KP">north korea</option>
                <option value="MK">north macedonia</option>
                <option value="MP">northern mariana islands</option>
                <option value="NO">norway</option>
                <option value="OM">oman</option>
                <option value="PK">pakistan</option>
                <option value="PW">palau</option>
                <option value="PS">palestine</option>
                <option value="PA">panama</option>
                <option value="PG">papua new guinea</option>
                <option value="PY">paraguay</option>
                <option value="PE">peru</option>
                <option value="PH">philippines</option>
                <option value="PN">pitcairn islands</option>
                <option value="PL">poland</option>
                <option value="PT">portugal</option>
                <option value="PR">puerto rico</option>
                <option value="QA">qatar</option>
                <option value="CG">republic of the congo</option>
                <option value="RE">réunion</option>
                <option value="RO">romania</option>
                <option value="RU">russia</option>
                <option value="RW">rwanda</option>
                <option value="BL">saint barthélemy</option>
                <option value="SH">
                  saint helena, ascension and tristan da cunha
                </option>
                <option value="KN">saint kitts and nevis</option>
                <option value="LC">saint lucia</option>
                <option value="MF">saint martin</option>
                <option value="PM">saint pierre and miquelon</option>
                <option value="VC">saint vincent and the grenadines</option>
                <option value="WS">samoa</option>
                <option value="SM">san marino</option>
                <option value="ST">são tomé and príncipe</option>
                <option value="SA">saudi arabia</option>
                <option value="SN">senegal</option>
                <option value="RS">serbia</option>
                <option value="SC">seychelles</option>
                <option value="SL">sierra leone</option>
                <option value="SG">singapore</option>
                <option value="SX">sint maarten</option>
                <option value="SK">slovakia</option>
                <option value="SI">slovenia</option>
                <option value="SB">solomon islands</option>
                <option value="SO">somalia</option>
                <option value="ZA">south africa</option>
                <option value="GS">south georgia</option>
                <option value="KR">south korea</option>
                <option value="SS">south sudan</option>
                <option value="ES">spain</option>
                <option value="LK">sri lanka</option>
                <option value="SD">sudan</option>
                <option value="SR">suriname</option>
                <option value="SJ">svalbard and jan mayen</option>
                <option value="SE">sweden</option>
                <option value="CH">switzerland</option>
                <option value="SY">syria</option>
                <option value="TW">taiwan</option>
                <option value="TJ">tajikistan</option>
                <option value="TZ">tanzania</option>
                <option value="TH">thailand</option>
                <option value="TL">timor-leste</option>
                <option value="TG">togo</option>
                <option value="TK">tokelau</option>
                <option value="TO">tonga</option>
                <option value="TT">trinidad and tobago</option>
                <option value="TN">tunisia</option>
                <option value="TR">turkey</option>
                <option value="TM">turkmenistan</option>
                <option value="TC">turks and caicos islands</option>
                <option value="TV">tuvalu</option>
                <option value="UG">uganda</option>
                <option value="UA">ukraine</option>
                <option value="AE">united arab emirates</option>
                <option value="GB">united kingdom</option>
                <option value="US">united states</option>
                <option value="UM">united states minor outlying islands</option>
                <option value="VI">united states virgin islands</option>
                <option value="UY">uruguay</option>
                <option value="UZ">uzbekistan</option>
                <option value="VU">vanuatu</option>
                <option value="VA">vatican city</option>
                <option value="VE">venezuela</option>
                <option value="VN">vietnam</option>
                <option value="WF">wallis and futuna</option>
                <option value="EH">western sahara</option>
                <option value="YE">yemen</option>
                <option value="ZM">zambia</option>
                <option value="ZW">zimbabwe</option>
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
          <p className="form-row form-row-wide mt-2">
            <button
              type="submit"
              className="woocommerce-Button woocommerce-button button woocommerce-form-register__submit cursor-pointer"
              name="register"
              value="Register"
              disabled={isRegistering} // or your loading variable name
            >
              {isRegistering ? <span className="spinner"></span> : "Register"}
            </button>
          </p>
        </form>
      </div>
    </>
  );
};
