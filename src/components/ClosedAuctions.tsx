import Link from 'next/link';
import React from 'react';

export const ClosedAuctions = () => {
  return (
    <div className="flex justify-center pt-[30px] md:pt-[60px]">
      <Link
        className="focus:outline-none border border-[#dac172] text-white bg-golden-bold font-bold text-[14px] text-center px-7 py-4 hover:bg-transparent hover:border hover:border-[#dac172] hover:text-[#dac172] transition-all duration-300"
        href="/closed-auctions"
      >
        View All Closed Auctions
      </Link>
    </div>
  );
};