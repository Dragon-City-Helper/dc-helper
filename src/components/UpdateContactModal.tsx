'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Modal, TextInput, Button, Group, Text, Stack, Box } from '@mantine/core';
import { IconBrandDiscord, IconBrandTwitter, IconBrandInstagram, IconBrandFacebook, IconBrandReddit, IconX } from '@tabler/icons-react';
import { userApi } from '@/services/api/user';
import { useForm } from '@mantine/form';

interface UpdateContactModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  initialData: {
    discord: string | null;
    facebook: string | null;
    twitter: string | null;
    instagram: string | null;
    reddit: string | null;
  } | null;
  forceUpdate?: boolean;
}

type ContactFormValues = {
  discord: string;
  facebook: string;
  twitter: string;
  instagram: string;
  reddit: string;
};

export default function UpdateContactModal({ 
  isOpen, 
  onClose, 
  initialData, 
  forceUpdate = false 
}: UpdateContactModalProps) {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Create a form key based on the initialData to force remount when it changes
  const formKey = JSON.stringify(initialData || {});
  
  const form = useForm<ContactFormValues>({
    initialValues: {
      discord: initialData?.discord || '',
      facebook: initialData?.facebook || '',
      twitter: initialData?.twitter || '',
      instagram: initialData?.instagram || '',
      reddit: initialData?.reddit || '',
    },
  });

  const hasAtLeastOneContactMethod = (values: ContactFormValues) => {
    return Object.values(values).some(value => value && value.trim() !== '');
  };

  const handleSubmit = async (values: ContactFormValues) => {
    // Basic validation
    if (!hasAtLeastOneContactMethod(values)) {
      setError('Please provide at least one contact method');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/contact', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to update contact information');
      }

      // Get the updated user data from the response
      const updatedUser = await response.json();
      
      // Update the session with the new data
      await update({
        ...session,
        user: {
          ...session?.user,
          Contacts: updatedUser.Contacts
        }
      });
      
      setSuccess(true);
      
      // Close the modal after a short delay to show success message
      setTimeout(() => {
        setSuccess(false);
        setError(null);
        onClose(true);
      }, 1500);
    } catch (err) {
      console.error('Failed to update contact:', err);
      setError(err instanceof Error ? err.message : 'Failed to update contact information');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal 
      opened={isOpen} 
      onClose={forceUpdate ? () => {} : () => onClose(false)} 
      title={forceUpdate ? "Contact Information Required" : "Update Contact Information"}
      size="md"
      withCloseButton={!forceUpdate}
      closeOnClickOutside={!forceUpdate}
      closeOnEscape={!forceUpdate}
      padding="lg"
      radius="md"
      closeButtonProps={{ 'aria-label': 'Close modal' }}
    >
      {forceUpdate && (
        <Text mb="md" c="dimmed" size="sm">
          To use the Trading Hub, we need at least one way for other players to contact you. 
          This helps ensure smooth trades and better communication. Your contact information 
          is only visible to users whose trades you interact with.
        </Text>
      )}
      {error && (
        <Box mb="md" p="sm" bg="red.1" style={{ borderRadius: 'var(--mantine-radius-md)' }}>
          <Text c="red.7" size="sm">{error}</Text>
        </Box>
      )}

      {success ? (
        <Box mb="md" p="sm" bg="green.1" style={{ borderRadius: 'var(--mantine-radius-md)' }}>
          <Text c="green.7" size="sm">Contact information updated successfully!</Text>
        </Box>
      ) : (
        <form key={formKey} onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="lg">
            <TextInput
              label="Discord"
              placeholder="username#1234"
              description="Enter your Discord username and discriminator (e.g., username#1234)"
              leftSection={<IconBrandDiscord size={18} />}
              styles={{
                input: { minHeight: 42 },
                section: { marginRight: 8 }
              }}
              {...form.getInputProps('discord')}
            />

            <TextInput
              label="Facebook"
              placeholder="username"
              description="Enter your Facebook username (the part after facebook.com/ in your profile URL)"
              leftSection={
                <Group gap={2} w={32} wrap="nowrap">
                  <IconBrandFacebook size={18} />
                  <Text size="sm" c="dimmed" lh={1}>
                    /
                  </Text>
                </Group>
              }
              styles={{
                input: {
                  minHeight: 42,
                  paddingLeft: 44,
                },
                section: { 
                  marginRight: 8,
                  pointerEvents: 'none',
                },
              }}
              {...form.getInputProps('facebook')}
            />

            <TextInput
              label="Reddit"
              placeholder="username"
              description={
                <>
                  Enter your Reddit username
                  <Text span c="dimmed" size="xs" display={{ base: 'none', sm: 'inline' }}> (without u/ prefix)</Text>
                </>
              }
              leftSection={
                <Group gap={4} w={36} wrap="nowrap">
                  <IconBrandReddit size={18} color="#FF4500" />
                  <Text size="sm" c="dimmed" lh={1}>
                    u/
                  </Text>
                </Group>
              }
              styles={{
                input: {
                  minHeight: 42,
                  paddingLeft: 44,
                },
                section: { 
                  marginRight: 8,
                  pointerEvents: 'none',
                },
                description: { whiteSpace: 'normal' }
              }}
              {...form.getInputProps('reddit')}
            />

            <TextInput
              label="Twitter"
              placeholder="username"
              description={
                <>
                  Enter your Twitter username
                  <Text span c="dimmed" size="xs" display={{ base: 'none', sm: 'inline' }}> (without @ symbol)</Text>
                </>
              }
              leftSection={
                <Text size="sm" c="dimmed" w={24} ta="center" mr={-10}>
                  @
                </Text>
              }
              styles={{
                input: { minHeight: 42 },
                section: { marginRight: 8 },
                description: { whiteSpace: 'normal' }
              }}
              {...form.getInputProps('twitter')}
            />

            <TextInput
              label="Instagram"
              placeholder="username"
              description={
                <>
                  Enter your Instagram username
                  <Text span c="dimmed" size="xs" display={{ base: 'none', sm: 'inline' }}> (without @ symbol)</Text>
                </>
              }
              leftSection={
                <Text size="sm" c="dimmed" w={24} ta="center" mr={-10}>
                  @
                </Text>
              }
              styles={{
                input: { minHeight: 42 },
                section: { marginRight: 8 },
                description: { whiteSpace: 'normal' }
              }}
              {...form.getInputProps('instagram')}
            />

            <Button 
              fullWidth 
              mt="md" 
              type="submit" 
              loading={isLoading}
              disabled={!hasAtLeastOneContactMethod(form.values)}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Stack>
        </form>
      )}
    </Modal>
  );
}
