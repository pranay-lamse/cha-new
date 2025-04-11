import { createHash } from "crypto"

export const generateSiteUrlSign = (siteUrl: string): string => {
    return createHash('md5').update(siteUrl).digest('hex');
}
