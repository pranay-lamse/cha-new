"use client";
import { useEffect, useState } from "react";

interface Props {
  title: string;
  startDate: string;
  endDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Function to calculate time difference in UTC-6
const calculateTimeLeft = (endTime: string): TimeLeft => {
  // Convert endDate to Central Time Zone (UTC-6)
  const endDate = new Date(
    new Date(endTime).toLocaleString("en-US", {
      timeZone: "America/Chicago", // Central Time (UTC-6)
    })
  );

  // Get the current time in Central Time (UTC-6)
  const now = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "America/Chicago",
    })
  );

  const difference = +endDate - +now;

  let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

export const Timer = ({ title, startDate, endDate }: Props) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="uwa_auction_time" id="uwa_auction_countdown">
      <p className="uwa_proxy_text mb-3">
        <strong>This auction is under proxy bidding.</strong>
      </p>

      <strong>Time Left (UTC-6):</strong>
      <div className="uwa_auction_product_countdown uwa-main-auction-product uwa_auction_product_countdown clock_jquery hasCountdown mt-1">
        <span className="countdown_row countdown_show4 flex space-x-4">
          <span className="countdown_section">
            <span className="countdown_amount">{timeLeft.days || "0"}</span>{" "}
            Day(s),
          </span>
          <span className="countdown_section">
            <span className="countdown_amount">{timeLeft.hours || "0"}</span>{" "}
            Hour(s),
          </span>
          <span className="countdown_section">
            <span className="countdown_amount">{timeLeft.minutes || "0"}</span>{" "}
            Min(s),
          </span>
          <span className="countdown_section">
            <span className="countdown_amount">{timeLeft.seconds || "0"}</span>{" "}
            Sec(s)
          </span>
        </span>
      </div>
    </div>
  );
};

export default Timer;
