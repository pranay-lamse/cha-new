import { FormSchema } from "@/lib/definitions";
import { recaptchaVerify } from "./recaptchaV3";

export const validationForm = async(formData: FormData) => {

    interface FormValues {
        name: FormDataEntryValue | null;
        phone: FormDataEntryValue | null;
        tokenRecaptcha: FormDataEntryValue | null;
        email?: FormDataEntryValue | null;
        type?: FormDataEntryValue | null;
        message?: FormDataEntryValue | null;
    };
    
    let data:FormValues = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        tokenRecaptcha: formData.get('token-recaptcha')
    };

    if(formData.has('email')) {
        data = {
            ...data,
            email: formData.get('email'),
        }
    }

    if(formData.has('type')) {
        data = {
            ...data,
            type: formData.get('type'),
        }
    }

    if(formData.has('message')) {
        data = {
            ...data,
            message: formData.get('message'),
        }
    }

    const validateFields = FormSchema.safeParse(data);
    
    if (!validateFields.success) {
        return {
            errors: validateFields.error.flatten().fieldErrors
        }
    }

    const { name, email, phone, type, message, tokenRecaptcha } = validateFields.data;
    const recaptchaResponse = await recaptchaVerify(tokenRecaptcha);

    if(!recaptchaResponse.success) {
        return {
            tokenRecaptcha: {
                _errors: ['Recaptcha verification failed']
            }
        }
    }

    return {
        name,
        email,
        phone,
        type,
        message
    }
}