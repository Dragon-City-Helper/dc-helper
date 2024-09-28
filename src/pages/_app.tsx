import type { AppProps } from "next/app";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "../styles/globals.css";
import NavBar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <SessionProvider session={session}>
        <NavBar />
        <div className="m-2">
          <Component {...pageProps} />
        </div>
      </SessionProvider>
      <SpeedInsights />
      <Analytics />
    </>
  );
}
