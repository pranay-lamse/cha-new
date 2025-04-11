"use client";

import { useState } from "react";
import { ButtonSubscribe } from "./ButtonSubscribe";
import { Form } from "./Form";

export const Subscribe = () => {
    
  const [issOpen, setIsOpen] = useState(false);

  return (
    <>
      <ButtonSubscribe setIsOpen={setIsOpen} />
      <Form isOpen={issOpen} setIsOpen={setIsOpen} />
    </>
  )
}