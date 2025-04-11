"use client";

import { raleway } from "@/config/fonts";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const ButtonSubscribe = ({setIsOpen}:Props) => {

  return (
    <div className="fixed mb-0 left-5 bottom-12 z-[1]">
    <button 
      type="button" 
      className={`${raleway.className} focus:outline-none text-white bg-golden-bold font-bold text-[14px] text-center px-8 py-4 border border-[#dac172] me-4 mb-2 hover:bg-transparent hover:border hover:border-[#dac172] hover:text-[#dac172] transition-all duration-300`}
      onClick={() => setIsOpen(true)}
    >
      Subscribe Now!
    </button>
  </div>
  
  )
}
