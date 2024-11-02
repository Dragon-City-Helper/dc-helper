import { FC } from "react";
import PrivacyPolicyPage from "@/views/Privacy";

export const metadata = {
  title: "Dragon City Helper - Privacy Policy",
  description:
    "Review the Privacy Policy for Dragon City Helper to understand how your data is collected, used, and protected within the app.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-static";

const Terms: FC = () => {
  return <PrivacyPolicyPage />;
};

export default Terms;
