"use server";

import { FormState } from "@/interfaces";
import { SEND_MAIL } from '@/graphql/mutations/sendMail';
import { getGoogleSheetsData } from '@/services/google-spreadsheet';
import { validationForm } from "@/utils/validationForm";
import { env } from "@/env";

export const newsletter = async(
    state: FormState,
    formData: FormData) => {

    const { errors, tokenRecaptcha, name, email, type, message, phone } = await validationForm(formData);
    if(errors) return {errors};
    if(tokenRecaptcha) return {tokenRecaptcha};

    const endpoint = env.NEXT_PUBLIC_API_URL!;
    const query = SEND_MAIL;
    const variables = {
        subject: `New message from Classic Horse Auction`,
        body: `
        <ul style="list-style: none;">
        <li>Your Name: ${name}</li>
        ${email ? `<li>Your Email: ${email}</li>` : ''}
        <li>Your Phone Number: ${phone}</li>
        ${type ? `<li>Subject: ${type}</li>` : ''}
        ${message ? `<li>Message: ${message}</li>` : ''}
    </ul>`
    }

    const headers = {
        Authorization: `Bearer ${env.NEXT_PUBLIC_WORDPRESS_JWT_REFRESH_TOKEN}`,
        'Content-Type': 'application/json',
        'Origin': env.AUTH_URL!
    };

    try {

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ query, variables }),
            next: {
                revalidate: 60
            }
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const { data } = await res.json();
        const { sendEmail } = data;

        if(!sendEmail.sent) {
            throw new Error(sendEmail.message);
        }

        const range = "Sheet1!A1:C";
        const sheets = getGoogleSheetsData();
        (await sheets).spreadsheets.values.append({
            spreadsheetId: env.GOOGLE_SHEET_ID,
            range,
            valueInputOption: "RAW",
            requestBody: {
                values: [[name, email || '', phone, type || '', message || '']]
            }
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error('GraphQL Error:', error.message);
        }
        throw new Error('Newsletter: Notification could not be sent');
    }
}
