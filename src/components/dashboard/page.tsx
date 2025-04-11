import Link from "next/link";
import MenuPage from "../my-account-menu/page";
import { lora } from "@/config/fonts";
import Cookies from "js-cookie";
interface UserProps {
  user: {
    firstName?: string;
  };
}

export default function Dashboard({ user }: UserProps) {
  return (
    <div className="container mx-auto w-full sm:w-11/12 lg:w-[1170px] px-2">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 myaccount-info">
        <div className="col-span-1">
          <MenuPage />
        </div>
        <div className="col-span-1 md:col-span-3 pl-0 md:pl-[60px]">
          <div className="table-wrapper">
            <div className="">
              <p
                className={`${lora.className} font-[500] text-[14px] text-[#69727d] leading-[1.8] pb-3`}
              >
                Hello <strong>{user?.firstName} </strong>
                <button
                  onClick={() => {
                    Cookies.remove("authToken");
                    Cookies.remove("refreshToken");
                    Cookies.remove("user");
                    Cookies.remove("rememberMe");
                    window.location.href = "/my-account";
                  }}
                  className={`text-[#5bc0de] font-[500]`}
                >
                  (Log out)
                </button>
              </p>
              <p
                className={`${lora.className} font-[500] text-[14px] text-[#69727d] leading-[1.8]`}
              >
                From your account dashboard you can view your{" "}
                <Link
                  href="/my-account/orders/"
                  className="text-[#5bc0de] font-[500]"
                >
                  recent orders
                </Link>
                , manage your{" "}
                <Link
                  href="/my-account/edit-address/"
                  className="text-[#5bc0de] font-[500]"
                >
                  shipping and billing addresses
                </Link>
                , and{" "}
                <Link
                  href="/my-account/edit-account/"
                  className="text-[#5bc0de] font-[500]"
                >
                  edit your password and account details.
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
