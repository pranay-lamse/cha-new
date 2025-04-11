import { newsletter } from "@/actions";
import { marcellus, raleway } from "@/config/fonts";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { ReCaptcha } from "next-recaptcha-v3";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, SetStateAction, useActionState, useState } from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const Form = ({ isOpen, setIsOpen }: Props) => {

  const [state, action, pending] = useActionState(newsletter, undefined);
  const [token, setToken] = useState<string>();

  return (
    <div
      className={
        clsx(
          "target:block content-center inset-0 bg-black/75 overflow-auto z-99",
          {
            "hidden": !isOpen,
            "fixed": isOpen
          }
        )
      }>
      <div className="ml-[20px] mr-[20px] sm:w-8/12 md:w-1/3 sm:mx-auto h-auto grid">
        <div className="bg-deep-navy px-10 pt-2 pb-6 rounded-t-xl">
          <FontAwesomeIcon
            icon={faClose}
            className="flex relative top-2 text-golden-light hover:text-white cursor-pointer left-full"
            onClick={() => setIsOpen(false)}
          />
          <Image
            src="/assets/img/logo.png"
            alt="Logo"
            width={700}
            height={300}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        <div className="rounded-b-xl bg-white">
          <div className="my-5">
            <h2 className={`${marcellus.className} text-[26px] sm:text-5xl text-center font-bold mb-5`}>
              Subscribe Now!
            </h2>

            <p className={`${raleway.className} text-center text-sm font-semibold`}>Join our VIP text and email list to receive notifications on upcoming sales!</p>
          </div>
          <form action={action} className="grid items-center justify-center rounded-b-xl bg-white mx-auto">
            <div className="relative md:mb-3 mb-3 px-2.5">
              <input type="text" name="phone" className={`${raleway.className} block w-full h-11 px-5 py-2.5 leading-7 text-base font-normal shadow-xs text-gray-900 border rounded-md placeholder-opacity-60 placeholder-black placeholder:uppercase placeholder:text-sm focus:outline-none`} placeholder="Mobile Number" />
              {state?.errors?.phone && <p className="text-red-600">{state.errors.phone}</p>}
            </div>
            <div className="relative md:mb-3 mb-2 px-2.5">
              <input type="text" name="name" className={`${raleway.className} block w-full h-11 px-5 py-2.5 leading-7 text-base font-normal shadow-xs text-gray-900 border rounded-md placeholder-opacity-60 placeholder-black placeholder:uppercase placeholder:text-sm focus:outline-none`} placeholder="Name" />
              {state?.errors?.name && <p className="text-red-600">{state.errors.name}</p>}
            </div>
            <div className="relative md:mb-3 mb-3">
              <input type="hidden" name="token-recaptcha" value={token} />
              {state?.errors?.tokenRecaptcha && <p className="text-red-600">{state.errors.tokenRecaptcha}</p>}
              <ReCaptcha onValidate={setToken} action="newsletter" />
            </div>
            <div className="relative md:mb-3 mb-2 px-2.5">
              <button type="submit" disabled={pending} className="focus:outline-none w-full text-white bg-golden-bold font-medium text-base text-center px-8 py-2.5 rounded-sm">
                Send
              </button>
            </div>
            <div className="relative mb-5 px-2.5">
              <p className={`${raleway.className} text-justify text-xxs font-bold`}>
                By submitting this form, you agree to receive automated promotional messages. Consent is not a condition of purchase. The message frequency varies. Reply STOP to opt-out or HELP for help. Message & data rates apply. Terms and privacy policies can be found <Link href="/privacy-policy">here</Link>.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
