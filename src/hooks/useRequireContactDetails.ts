import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function useRequireContactDetails(redirectPath = '/') {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  
  // Check if user has any contact details
  const hasContactDetails = useCallback(() => {
    if (status !== 'authenticated' || !session?.user?.Contacts) return false;
    
    const { Contacts } = session.user;
    return (
      (Contacts.discord && Contacts.discord.trim() !== '') ||
      (Contacts.facebook && Contacts.facebook.trim() !== '') ||
      (Contacts.twitter && Contacts.twitter.trim() !== '') ||
      (Contacts.instagram && Contacts.instagram.trim() !== '') ||
      (Contacts.reddit && Contacts.reddit?.trim() !== '')
    );
  }, [session, status]);

  // Show modal only when session is loaded and user has no contact details
  useEffect(() => {
    if (status === 'authenticated') {
      const hasDetails = hasContactDetails();
      setShowModal(!hasDetails);
    }
  }, [status, hasContactDetails]);

  const onClose = (userHasContactDetails?: boolean) => {
    setShowModal(false);
    if (userHasContactDetails === false) {
      router.push(redirectPath);
    }
  };

  return { 
    showModal, 
    onClose, 
    hasContactDetails: hasContactDetails() 
  };
}
