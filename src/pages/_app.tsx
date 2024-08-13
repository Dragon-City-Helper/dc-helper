import type { AppProps } from "next/app";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react"
import "../styles/globals.css";
import NavBar from "@/components/Navbar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <NavBar />
      <div className="m-2">
        <Component {...pageProps} />
      </div>
      <SpeedInsights />
      <Analytics />
    </>
  );
}
