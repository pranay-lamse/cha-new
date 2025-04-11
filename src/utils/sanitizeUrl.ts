export const sanitizeUrl = (url: string) => {
    return url.length > 1 ? url.replace(/\/$/, "") : url; 
}