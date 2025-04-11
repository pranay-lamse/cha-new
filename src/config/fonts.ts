import { Marcellus, Raleway, Roboto, Merriweather, Lora, Cormorant_SC, Noto_Serif } from 'next/font/google';

export const marcellus = Marcellus({ subsets: ["latin"], weight: ['400'], preload: false, display: 'swap' });
export const raleway = Raleway({ subsets: ['latin'], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], preload: false, display: 'swap' });
export const roboto = Roboto({ subsets: ['latin'], weight: ['400'], preload: false, display: 'swap' });
export const merriweather = Merriweather({ subsets: ['latin'], weight: ['400', '700'], preload: false, display: 'swap' });
export const lora = Lora({ subsets: ['latin'], weight: ['400', '500', '600', '700'], preload: false, display: 'swap' });
export const cormorantSC = Cormorant_SC({ subsets: ['latin'], weight: ['400', '500', '600', '700'], preload: false, display: 'swap' });
export const notoSerif = Noto_Serif({ subsets: ['latin'], weight: ['400', '700'], preload: false, display: 'swap' });

