"use client";

import { Box, Button, Card, Group, Stack, Text, Title, Divider, Badge, Container, Tooltip, ActionIcon, Modal, TextInput, SimpleGrid, rem, Avatar, Collapse } from "@mantine/core";
import { IconArrowLeft, IconEdit, IconTrash, IconEye, IconEyeOff, IconMessageCircle, IconChevronDown, IconChevronUp, IconUser, IconMail, IconPhone, IconMessage } from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { sendGAEvent } from "@next/third-parties/google";
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import TradeDragonFaceCard from "../TradeDragonFaceCard";
import { UITrades } from "@/services/trades";
import { requestTrade } from "@/services/tradeApi";
import { showNotification } from "@mantine/notifications";

interface ContactInfo {
  discord?: string;
  email?: string;
  phone?: string;
  inGameName?: string;
}

interface TradeRequestUser {
  id: string;
  name: string | null;
  image: string | null;
  Contacts: ContactInfo | null;
}

interface TradeRequest {
  id: string;
  status: string;
  createdAt: string;
  createdBy: TradeRequestUser;
}

const handleEssencesDisplay = {
  YES: 'Poster Handles Essence',
  NO: 'Requestor Handles Essence',
  SHARED: 'Both Players Share Essence',
};

interface TradeDetailProps {
  trade: UITrades[number];
  onEditTrade?: (trade: UITrades[number]) => void;
}

export default function TradeDetail({ trade, onEditTrade }: TradeDetailProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isRequesting, setIsRequesting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [tradeRequests, setTradeRequests] = useState<TradeRequest[]>([]);
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);
  const [deleteOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [requestedTrades, setRequestedTrades] = useState<Set<string>>(new Set());
  
  const isOwner = session?.user?.id === trade.userId;
  const isRequested = requestedTrades.has(trade.id);
  
  useEffect(() => {
    const loadRequestedTrades = async () => {
      if (!session?.user?.id) return;
      
      try {
        const response = await fetch('/api/trade-requests/me');
        if (!response.ok) throw new Error('Failed to fetch trade requests');
        
        const requests = await response.json();
        const userRequestedTradeIds = new Set<string>(
          requests.data.map((req: { tradeId: string }) => req.tradeId)
        );
        setRequestedTrades(userRequestedTradeIds);
      } catch (error) {
        console.error('Error fetching trade requests:', error);
      }
    };
    
    loadRequestedTrades();
  }, [session?.user?.id]);

  // Load trade requests if user is the owner
  useEffect(() => {
    const loadTradeRequests = async () => {
      if (!isOwner || !session?.user?.id) return;
      
      setIsLoadingRequests(true);
      try {
        const response = await fetch(`/api/trade-requests?tradeId=${trade.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.data)) {
            const typedData = data.data as TradeRequest[];
            setTradeRequests(typedData);
          }
        }
      } catch (error) {
        console.error('Error loading trade requests:', error);
      } finally {
        setIsLoadingRequests(false);
      }
    };
    
    loadTradeRequests();
  }, [isOwner, trade.id, session?.user?.id]);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isSmallScreen = useMediaQuery('(max-width: 480px)');
  const titleOrder = isMobile ? 3 : 2;
  const buttonSize = isMobile ? 'sm' : 'md';
  
  const handleToggleVisibility = async () => {
    try {
      setIsToggling(true);
      const response = await fetch(`/api/trades/${trade.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !trade.isVisible })
      });
      
      if (!response.ok) throw new Error('Failed to update trade');
      
      // Track trade visibility toggle in Google Analytics
      sendGAEvent("event", "toggle_trade_visibility", {
        trade_id: trade.id,
        dragon_requested: trade.lookingFor.dragon.name,
        new_visibility: !trade.isVisible ? "visible" : "hidden"
      });
      
      showNotification({
        title: 'Success',
        message: `Trade is now ${trade.isVisible ? 'hidden' : 'visible'}`,
        color: 'green',
      });
      
      // Refresh the page to show the updated state
      router.refresh();
    } catch (error) {
      console.error('Error toggling visibility:', error);
      showNotification({
        title: 'Error',
        message: 'Failed to update trade visibility',
        color: 'red',
      });
    } finally {
      setIsToggling(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/trades/${trade.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete trade');
      
      // Track trade deletion in Google Analytics
      sendGAEvent("event", "trade_deleted", {
        trade_id: trade.id,
        dragon_requested: trade.lookingFor.dragon.name,
        from_page: 'trade_detail'
      });
      
      showNotification({
        title: 'Success',
        message: 'Trade deleted successfully',
        color: 'green',
      });
      
      // Redirect to the trades page after deletion
      router.push('/trading-hub');
    } catch (error) {
      console.error('Error deleting trade:', error);
      showNotification({
        title: 'Error',
        message: 'Failed to delete trade',
        color: 'red',
      });
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  };

  const handleRequestTrade = async () => {
    if (!session) {
      // Track sign-in redirection for trade request
      sendGAEvent("event", "sign_in_required", {
        action: "trade_request",
        trade_id: trade.id
      });
      router.push('/auth/signin');
      return;
    }

    try {
      setIsRequesting(true);
      await requestTrade(trade);
      
      // Track trade request in Google Analytics
      sendGAEvent("event", "trade_requested", {
        trade_id: trade.id,
        dragon_requested: trade.lookingFor.dragon.name,
        requester_id: session.user?.id,
        trade_owner_id: trade.userId
      });
      
      // Update local state to show request was sent
      setRequestedTrades(prev => new Set(Array.from(prev).concat(trade.id)))
      
      showNotification({
        title: 'Trade Requested',
        message: 'Your trade request has been sent to the trader',
        color: 'green',
      });
    } finally {
      setIsRequesting(false);
    }
  };

  if (!trade) {
    return (
      <Container size="md" py="xl">
        <Text>Trade not found</Text>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Button
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => router.back()}
        mb="md"
      >
        Back to Trades
      </Button>

      <Card withBorder radius="md" p={{ base: 'sm', sm: 'md' }} style={{ position: 'relative', zIndex: 1 }}>
        <Stack gap="md">
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <Box style={{ flex: 1, minWidth: 0 }}>
              <Title order={titleOrder} mb={4} style={{ wordBreak: 'break-word' }}>
                {trade.lookingFor.dragon.name}
              </Title>
              <Group gap={8} wrap="wrap">
                <Text size={isMobile ? 'xs' : 'sm'} c="dimmed">
                  {formatDistanceToNow(new Date(trade.createdAt), { addSuffix: true })}
                </Text>
                {trade.isSponsored && (
                  <Badge color="yellow" variant="light" size={isMobile ? 'sm' : 'md'}>
                    Sponsored
                  </Badge>
                )}
                {!trade.isVisible && (
                  <Badge color="orange" variant="light" size={isMobile ? 'sm' : 'md'}>
                    Hidden
                  </Badge>
                )}
              </Group>
            </Box>
            
            {isOwner && (
              <Group gap={isMobile ? 4 : 8} wrap="nowrap">
                <Tooltip label={trade.isVisible ? 'Hide trade' : 'Show trade'}>
                  <ActionIcon
                    variant="subtle"
                    color={trade.isVisible ? 'blue' : 'gray'}
                    loading={isToggling}
                    onClick={handleToggleVisibility}
                    size={isMobile ? 'sm' : 'md'}
                  >
                    {trade.isVisible ? <IconEye size={18} /> : <IconEyeOff size={18} />}
                  </ActionIcon>
                </Tooltip>
                
                <Tooltip label="Edit trade">
                  <ActionIcon
                    variant="subtle"
                    color="blue"
                    onClick={() => {
                      // Track edit trade click
                      sendGAEvent("event", "edit_trade_click", {
                        trade_id: trade.id,
                        from_page: 'trade_detail'
                      });
                      
                      if (onEditTrade) {
                        onEditTrade(trade);
                      } else {
                        router.push(`/trades/${trade.id}/edit`);
                      }
                    }}
                    size={isMobile ? 'sm' : 'md'}
                  >
                    <IconEdit size={18} />
                  </ActionIcon>
                </Tooltip>
                
                <Tooltip label="Delete trade">
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={openDeleteModal}
                    size={isMobile ? 'sm' : 'md'}
                  >
                    <IconTrash size={18} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            )}
          </Group>
          
          {/* Delete Confirmation Modal */}
          <Modal
            opened={deleteOpened}
            onClose={closeDeleteModal}
            title="Delete Trade"
            centered
          >
            <Text mb="md">Are you sure you want to delete this trade? This action cannot be undone.</Text>
            <Group justify="flex-end">
              <Button variant="default" onClick={closeDeleteModal}>
                Cancel
              </Button>
              <Button
                color="red"
                loading={isDeleting}
                onClick={handleDelete}
                leftSection={<IconTrash size={16} />}
              >
                Delete
              </Button>
            </Group>
          </Modal>

          <Divider my="md" />

          {/* Looking For Section */}
          <Box>
            <Title order={isMobile ? 4 : 3} mb="sm">Looking For</Title>
            <Card withBorder p={{ base: 'xs', sm: 'md' }} radius="md">
              <Group wrap="nowrap" align="flex-start" gap="md" style={{ width: '100%' }}>
                <Box style={{ 
                  width: isMobile ? 80 : 120,
                  flexShrink: 0,
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <TradeDragonFaceCard 
                    dragon={trade.lookingFor.dragon} 
                    size={isMobile ? 'sm' : 'lg'}
                  />
                </Box>
                <Box style={{ 
                  flex: 1, 
                  minWidth: 0,
                  paddingLeft: isMobile ? 'sm' : 'md',
                  paddingTop: isMobile ? 0 : 'sm',
                  overflow: 'hidden'
                }}>
                  <Text 
                    fw={600} 
                    size={isMobile ? 'sm' : 'lg'}
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {trade.lookingFor.dragon.name}
                  </Text>
                  <Text 
                    size={isMobile ? 'sm' : 'md'} 
                    c="green" 
                    fw={600}
                    mt={isMobile ? 2 : 4}
                  >
                    {trade.lookingFor.orbCount} orbs
                  </Text>
                </Box>
              </Group>
            </Card>
          </Box>

          {/* Can Give Section */}
          <Box>
            <Title order={isMobile ? 4 : 3} mb="sm">Can Give</Title>
            <SimpleGrid 
              cols={{ base: 1, sm: 2, md: 3 }}
              spacing={{ base: 'sm', sm: 'md' }}
            >
              {trade.canGive.map((item) => (
                <Card key={item.dragonsId} withBorder shadow="sm" p="sm" radius="md">
                  <Stack align="center" gap={4}>
                    <TradeDragonFaceCard 
                      dragon={item.dragon} 
                      size={isMobile ? 'sm' : 'md'} 
                    />
                    <Text fw={600} size={isMobile ? 'sm' : 'md'} ta="center">{item.dragon.name}</Text>
                    <Text size={isMobile ? 'sm' : 'md'} c="green" fw={500}>
                      {item.orbCount} orbs
                    </Text>
                    <Text size={isMobile ? 'xs' : 'sm'} c="dimmed">
                      Ratio: {item.ratioLeft}:{item.ratioRight}
                    </Text>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>
          </Box>


          {/* Essence Handling Section */}
          <Box mt="md">
            <Title order={isMobile ? 5 : 4} mb="sm">Essence Handling</Title>
            <Card withBorder p={{ base: 'sm', sm: 'md' }} radius="md">
              <Text 
                size={isMobile ? 'sm' : 'md'}
                fw={500} 
                c={trade.handleEssences === 'SHARED' ? 'green' : 'dimmed'}
              >
                {handleEssencesDisplay[trade.handleEssences]}
              </Text>
            </Card>
          </Box>

          {/* Subtle Promotional Note */}
          <Text 
            size="xs" 
            c="dimmed" 
            ta="center" 
            mt="xl"
            style={{
              fontStyle: 'italic',
              opacity: 0.7
            }}
          >
            Trade listed on Dragon City Helper • Connect with more trainers • Complete your collection
          </Text>

          {/* Request Button */}
          {session?.user?.id !== trade.userId ? (
            <Group justify="flex-end" mt={{ base: 'md', sm: 'xl' }}>
              <Button
                size={isMobile ? 'md' : 'lg'}
                onClick={handleRequestTrade}
                loading={isRequesting}
                disabled={isRequesting || isRequested}
                variant={isRequested ? 'outline' : 'filled'}
                fullWidth={isMobile}
                leftSection={isRequested ? <IconMessageCircle size={20} /> : null}
              >
                {isRequested ? 'Request Sent' : 'Request Trade'}
              </Button>
            </Group>
          ) : (
            <Box mt="xl">
              <Title order={isMobile ? 4 : 3} mb="md">
                Trade Requests ({tradeRequests.length})
              </Title>
              
              {isLoadingRequests ? (
                <Text>Loading requests...</Text>
              ) : tradeRequests.length === 0 ? (
                <Text c="dimmed" mb="md">No requests yet</Text>
              ) : (
                <Stack gap="sm">
                  {tradeRequests.map((request) => (
                    <Card key={request.id} withBorder p="md" radius="md">
                      <Group justify="space-between">
                        <Group gap="sm">
                          <Avatar 
                            src={request.createdBy.image} 
                            alt={request.createdBy.name || 'User'}
                            radius="xl"
                            size={40}
                          />
                          <div>
                            <Text fw={500}>{request.createdBy.name || 'Anonymous User'}</Text>
                            <Text size="sm" c="dimmed">
                              {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                            </Text>
                          </div>
                        </Group>
                        <Button
                          variant="subtle"
                          size="xs"
                          rightSection={
                            expandedRequestId === request.id ? (
                              <IconChevronUp size={16} />
                            ) : (
                              <IconChevronDown size={16} />
                            )
                          }
                          onClick={() => {
                            const isExpanding = expandedRequestId !== request.id;
                            if (isExpanding) {
                              // Track when user views contact information
                              sendGAEvent("event", "view_contact_info", {
                                trade_id: trade.id,
                                requester_id: request.createdBy.id,
                                has_discord: !!request.createdBy.Contacts?.discord,
                                has_email: !!request.createdBy.Contacts?.email,
                                has_phone: !!request.createdBy.Contacts?.phone,
                                has_ingame: !!request.createdBy.Contacts?.inGameName
                              });
                            }
                            setExpandedRequestId(
                              expandedRequestId === request.id ? null : request.id
                            );
                          }}
                        >
                          {expandedRequestId === request.id ? 'Hide' : 'View'} Contact
                        </Button>
                      </Group>
                      
                      <Collapse in={expandedRequestId === request.id} mt="md">
                        <Divider mb="md" />
                        <Stack gap="xs">
                          {request.createdBy.Contacts?.inGameName && (
                            <Group gap="sm">
                              <IconUser size={18} />
                              <Text>In-game: {request.createdBy.Contacts.inGameName}</Text>
                            </Group>
                          )}
                          {request.createdBy.Contacts?.discord && (
                            <Group gap="sm">
                              <IconMessage size={18} />
                              <Text>Discord: {request.createdBy.Contacts.discord}</Text>
                            </Group>
                          )}
                          {request.createdBy.Contacts?.email && (
                            <Group gap="sm">
                              <IconMail size={18} />
                              <Text>Email: {request.createdBy.Contacts.email}</Text>
                            </Group>
                          )}
                          {request.createdBy.Contacts?.phone && (
                            <Group gap="sm">
                              <IconPhone size={18} />
                              <Text>Phone: {request.createdBy.Contacts.phone}</Text>
                            </Group>
                          )}
                        </Stack>
                      </Collapse>
                    </Card>
                  ))}
                </Stack>
              )}
            </Box>
          )}
        </Stack>
      </Card>
    </Container>
  );
}
