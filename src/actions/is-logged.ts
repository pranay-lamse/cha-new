"use server";

import { env } from '@/env';
import { generateSiteUrlSign } from '@/utils/generateSiteUrlSign';
import { cookies } from 'next/headers';

export const isLogged = async():Promise<boolean> => {
    const cookieStore = await cookies();

    const apiUrl = env.NEXT_PUBLIC_API_URL!;
    const siteUrl = apiUrl?.replace('/graphql', '');
    const sign = generateSiteUrlSign(siteUrl);
    const nameCookie = `wordpress_logged_in_${sign}`;

    return !!cookieStore.get(nameCookie)?.value;
}
