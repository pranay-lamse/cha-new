"use server";

import { FormState } from "@/interfaces";
import { validationForm } from "@/utils/validationForm";

export const subscribe = async (
    state: FormState,
    formData: FormData
) => {

    const { errors, tokenRecaptcha } = await validationForm(formData);
    if(errors) return {errors};
    if(tokenRecaptcha) return {tokenRecaptcha};

}
