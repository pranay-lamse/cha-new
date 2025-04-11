import { z } from "zod";

export const FormSchema = z.object({
    name: z
    .string()
   .min(2, {message: "Name must be at least 2 characters long."})
   .trim(),
   email: 
   z.string()
   .email({message: "Please enter a valid email."})
   .trim()
   .optional(),
   phone: 
   z.string()
   .regex(/\d/, { message: "Must contain at least one number"})
   .trim(),
   type: 
   z.enum(["Horse Auction", "Bidding Question"], 
    { message: "Invalid selection"}),
   message:
   z.string()
   .min(10, "The message must be at least 10 characters long")
   .max(500, "The message cannot exceed 500 characters"),
   tokenRecaptcha: 
   z.string()
   .trim()
});