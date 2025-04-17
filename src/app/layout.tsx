export const revalidate = 60;
export const maxDuration = 60;
import { getMenus } from "@/actions";
import { Header, Footer, BarFooter, BarHeader } from "@/components";
/* import { ReCaptchaProvider } from "next-recaptcha-v3"; */
import "./globals.css";
import { AuthProvider } from "./providers/UserProvider";

const { menuItems } = await getMenus();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body>
          <BarHeader />
          <Header menuItems={menuItems.nodes} />
          {/*  <ReCaptchaProvider
            reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          > */}
          <main id="content" className="">
            {children}
          </main>
          {/* </ReCaptchaProvider> */}
          <Footer />
          <BarFooter />
        </body>
      </html>
    </AuthProvider>
  );
}
