"use client";
import axiosClientGeneralToken from "@/api/axiosClientGeneralToken";
import { GetInTouch } from "@/components";
import Loader from "@/components/Loader";
import { marcellus, raleway } from "@/config/fonts";
import {
  GET_PRIVACY_POLICY,
  GET_TERMS_CONDITIONS,
} from "@/graphql/queries/getPrivacyPolicy";
import {
  faEnvelope,
  faLocationArrow,
  faPhoneAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function ContactPage() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAbout = async () => {
      setLoading(true);
      try {
        const response = await axiosClientGeneralToken.post("", {
          query: GET_TERMS_CONDITIONS,
        });

        if (response.data?.data?.page) {
          setData(response.data.data);

          if (response.data.data) {
            console.log("data", response.data.data);
          }
        } else {
          setData({});
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
        setData({});
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);
  if (loading)
    return (
      <>
        <Loader />
      </>
    );
  return (
    <div className="grid">
      <div className="buyer-condition">
        <div dangerouslySetInnerHTML={{ __html: data.page.content }} />
      </div>
    </div>
  );
}
