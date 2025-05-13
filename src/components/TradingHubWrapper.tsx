"use client";

import { useSession } from "next-auth/react";
import { useRequireContactDetails } from "@/hooks/useRequireContactDetails";
import UpdateContactModal from "./UpdateContactModal";

export function TradingHubWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { showModal, onClose, hasContactDetails } = useRequireContactDetails("/");

  // If user is not logged in or has contact details, or modal shouldn't be shown, render children
  if (status !== 'authenticated' || hasContactDetails || !showModal) {
    return <>{children}</>;
  }

  // Show contact update modal only for logged-in users without contact details
  const initialData = session?.user?.Contacts
    ? {
        discord: session.user.Contacts.discord || null,
        facebook: session.user.Contacts.facebook || null,
        twitter: session.user.Contacts.twitter || null,
        instagram: session.user.Contacts.instagram || null,
        reddit: session.user.Contacts.reddit || null,
      }
    : null;

  return (
    <UpdateContactModal
      isOpen={true}
      onClose={(success) => onClose(success ?? false)}
      initialData={initialData}
      forceUpdate={true}
    />
  );
}
