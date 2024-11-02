import { FC } from "react";
import TermsAndConditionsPage from "@/views/Terms";

export const metadata = {
  title: "Dragon City Helper - Terms and Conditions",
  description:
    "Read the Terms and Conditions for using Dragon City Helper. Understand the guidelines, limitations, and user responsibilities for the app.",
  robots: {
    index: false,
    follow: false,
  },
};

export const revalidate = 84600;

const Terms: FC = () => {
  return <TermsAndConditionsPage />;
};

export default Terms;
