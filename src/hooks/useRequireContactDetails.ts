import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function useRequireContactDetails(redirectPath = '/') {
  const { data: session } = useSession();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  
  // Check if user has any contact details
  const hasContactDetails = Boolean(
    session?.user?.Contacts?.discord || 
    session?.user?.Contacts?.facebook || 
    session?.user?.Contacts?.twitter || 
    session?.user?.Contacts?.instagram
  );

  // Show modal only once when there are no contact details
  useEffect(() => {
    if (!hasContactDetails) {
      setShowModal(true);
    }
  }, [hasContactDetails]);

  const onClose = (userHasContactDetails: boolean) => {
    setShowModal(false);
    if (!userHasContactDetails) {
      router.push(redirectPath);
    }
  };

  return { showModal, onClose, hasContactDetails };
}
