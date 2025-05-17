"use client";

import { FC, useEffect, useState } from "react";
import {
  Modal,
  Stack,
  NumberInput,
  Divider,
  Group,
  Button,
  Alert,
  Title,
  Text,
  Card,
  SimpleGrid,
  ActionIcon,
  Box,
  Container,
  useMantineTheme,
  ScrollArea,
  Select,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { IconPlus, IconTrash, IconExchange, IconSearch } from "@tabler/icons-react";
import DragonSelect from "./DragonSelect";
import Ratio from "./Ratio";
import { TradeDragons } from "@/services/dragons";
import { CreateTradeInput, UITrades } from "@/services/trades";
import { createTradeApi } from "@/services/trades";
import { HandleEssences } from "@prisma/client";

interface CreateUpdateTradeModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (values: CreateTradeInput) => void;
  trade?: UITrades[number];
}

const CreateUpdateTradeModal: FC<CreateUpdateTradeModalProps> = ({
  opened,
  onClose,
  onSubmit,
  trade,
}) => {
  const [dragons, setDragons] = useState<TradeDragons>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateTradeInput>({
    initialValues: trade
      ? {
          lookingFor: {
            dragonId: trade.lookingFor.dragon.id,
            orbs: trade.lookingFor.orbCount,
          },
          canGiveDragons: trade.canGive.map((d) => ({
            dragonId: d.dragon.id,
            orbs: d.orbCount,
            ratioLeft: d.ratioLeft,
            ratioRight: d.ratioRight,
          })),
          isVisible: trade.isVisible,
          isSponsored: trade.isSponsored,
          handleEssences: trade.handleEssences,
          isDeleted: trade.isDeleted,
        }
      : {
          lookingFor: {
            dragonId: "",
            orbs: 100,
          },
          canGiveDragons: [
            {
              dragonId: "",
              orbs: 100,
              ratioLeft: 1,
              ratioRight: 1,
            },
          ],
          isVisible: true,
          isSponsored: false,
          handleEssences: "YES" as HandleEssences,
          isDeleted: false,
        },
    validate: (values) => {
      const errors: Record<string, string> = {};

      // Validate Looking For section
      if (!values.lookingFor.dragonId) {
        errors['lookingFor.dragonId'] = 'Please select a dragon you want';
      }
      if (!values.lookingFor.orbs || values.lookingFor.orbs < 1) {
        errors['lookingFor.orbs'] = 'Number of orbs must be at least 1';
      } else if (values.lookingFor.orbs > 1000) {
        errors['lookingFor.orbs'] = 'Number of orbs cannot exceed 1000';
      }

      // Validate Can Give section
      if (values.canGiveDragons.length === 0) {
        errors['canGiveDragons'] = 'Please add at least one dragon you can offer';
      } else {
        const seenDragonIds = new Set<string>();
        
        values.canGiveDragons.forEach((item, index) => {
          if (!item.dragonId) {
            errors[`canGiveDragons.${index}.dragonId`] = 'Please select a dragon';
          } else if (item.dragonId === values.lookingFor.dragonId) {
            errors[`canGiveDragons.${index}.dragonId`] = 'Cannot be the same as the dragon you\'re looking for';
          } else if (seenDragonIds.has(item.dragonId)) {
            errors[`canGiveDragons.${index}.dragonId`] = 'Duplicate dragon in the list';
          } else {
            seenDragonIds.add(item.dragonId);
          }

          if (!item.orbs || item.orbs < 1) {
            errors[`canGiveDragons.${index}.orbs`] = 'Number of orbs must be at least 1';
          } else if (item.orbs > 1000) {
            errors[`canGiveDragons.${index}.orbs`] = 'Number of orbs cannot exceed 1000';
          }

          if (!item.ratioLeft || item.ratioLeft < 1) {
            errors[`canGiveDragons.${index}.ratioLeft`] = 'Ratio left must be at least 1';
          } else if (item.ratioLeft > 100) {
            errors[`canGiveDragons.${index}.ratioLeft`] = 'Ratio left cannot exceed 100';
          }

          if (!item.ratioRight || item.ratioRight < 1) {
            errors[`canGiveDragons.${index}.ratioRight`] = 'Ratio right must be at least 1';
          } else if (item.ratioRight > 100) {
            errors[`canGiveDragons.${index}.ratioRight`] = 'Ratio right cannot exceed 100';
          }
        });
      }

      // Validate Handle Essences
      if (!values.handleEssences) {
        errors['handleEssences'] = 'Please select who will handle the essences';
      }

      return errors;
    },
  });

  useEffect(() => {
    const fetchDragons = async () => {
      try {
        const response = await fetch("/api/dragons/trade");
        if (!response.ok) {
          throw new Error("Failed to fetch trade dragons");
        }
        const dragons = await response.json();
        setDragons(dragons);
      } catch (error) {
        console.error("Error fetching trade dragons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDragons();
  }, []);

  const notify = (props: any) => notifications.show(props);

  const handleSubmit = async (values: CreateTradeInput) => {
    try {
      setError(null);
      
      // Prepare the trade data for the API
      const tradeData = {
        lookingForDragon: {
          dragonId: values.lookingFor.dragonId,
          orbs: values.lookingFor.orbs,
        },
        canGiveDragons: values.canGiveDragons.map(dragon => ({
          dragonId: dragon.dragonId,
          orbs: dragon.orbs,
          ratioLeft: dragon.ratioLeft,
          ratioRight: dragon.ratioRight
        })),
        handleEssences: values.handleEssences,
        isVisible: values.isVisible,
        isSponsored: values.isSponsored
      };

      // Call the API to create or update the trade
      const url = trade ? `/api/trades/${trade.id}` : '/api/trades';
      const method = trade ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tradeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create trade');
      }

      const data = await response.json();
      
      // Call the parent component's onSubmit callback with the new trade data
      onSubmit(data);
      
      // Reset the form and close the modal
      form.reset();
      onClose();
      
      // Show success notification
      notify({
        title: 'Success',
        message: trade ? 'Trade updated successfully' : 'Trade created successfully',
        color: 'green',
      });
    } catch (error) {
      console.error('Error saving trade:', error);
      
      // Set the error message
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An error occurred while saving the trade';
      
      setError(errorMessage);
      
      // Show error notification
      notify({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
    }
  };

  const handleAddCanGive = () => {
    form.setFieldValue("canGiveDragons", [
      ...form.values.canGiveDragons,
      {
        dragonId: "",
        orbs: 1,
        ratioLeft: 1,
        ratioRight: 1,
      },
    ]);
  };

  const theme = useMantineTheme();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={2}>{trade ? 'Update Trade' : 'Create New Trade'}</Title>}
      size="xl"
      centered
      styles={{
        title: { marginBottom: '0.5rem' },
        body: { paddingTop: 5 },
      }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <ScrollArea h="60vh" mb="md">
          {error && (
            <Alert title="Error" color="red" mb="lg">
              {error}
            </Alert>
          )}
          
          <Stack gap="lg">

            {/* Looking For Section */}
            <Card withBorder shadow="sm" p="md" radius="md">
              <Title order={3} size="h4" mb="md" c={theme.primaryColor}>
                <Group gap="xs">
                  <IconSearch size={20} />
                  <Text>Looking For</Text>
                </Group>
              </Title>
              
              {trade && (
                <Alert color="blue" mb="md">
                  Dragon selection cannot be modified when updating a trade. If you need to change dragons, please create a new trade.
                </Alert>
              )}
              
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <DragonSelect
                  value={form.values.lookingFor.dragonId}
                  onChange={(value) => {
                    if (!trade) {
                      form.setFieldValue("lookingFor.dragonId", value ?? "");
                    }
                  }}
                  dragons={dragons}
                  label="Select Dragon"
                  description="Search and select the dragon you want to receive"
                  placeholder="Choose a dragon you want"
                  loading={loading}
                  disabled={!!trade}
                />
                
                <NumberInput
                  value={form.values.lookingFor.orbs}
                  onChange={(value) => {
                    if (!trade) {
                      form.setFieldValue("lookingFor.orbs", Number(value));
                    }
                  }}
                  label="Number of Orbs"
                  description="How many orbs you're looking for"
                  min={1}
                  max={1000}
                  styles={{ input: { height: 42 } }}
                  disabled={!!trade}
                />
              </SimpleGrid>
            </Card>

            {/* Can Give Section */}
            <Card withBorder shadow="sm" p="md" radius="md">
              <Title order={3} size="h4" mb="md" c={theme.primaryColor}>
                <Group gap="xs">
                  <IconExchange size={20} />
                  <Text>Dragons You Can Offer</Text>
                </Group>
              </Title>
              
              {trade && (
                <Alert color="blue" mb="md">
                  Dragon offers cannot be modified when updating a trade. If you need to change the dragons you&apos;re offering, please create a new trade.
                </Alert>
              )}
              
              <Stack gap="lg">
                {form.values.canGiveDragons.map((dragon, index) => (
                  <Card key={index} withBorder shadow="xs" p="md" radius="md" style={{ borderColor: theme.colors.gray[3] }}>
                    <Stack gap="md">
                      <Group justify="space-between">
                        <Text fw={500} size="sm">Dragon #{index + 1}</Text>
                        <ActionIcon 
                          color="red" 
                          variant="light"
                          onClick={() => {
                            if (!trade) {
                              form.setFieldValue(
                                "canGiveDragons",
                                form.values.canGiveDragons.filter((_, i) => i !== index)
                              );
                            }
                          }}
                          disabled={form.values.canGiveDragons.length <= 1 || !!trade}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                      
                      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                        <DragonSelect
                          value={dragon.dragonId}
                          onChange={(value) => {
                            if (!trade) {
                              form.setFieldValue(
                                "canGiveDragons",
                                form.values.canGiveDragons.map((d, i) =>
                                  i === index ? { ...d, dragonId: value ?? "" } : d
                                )
                              );
                            }
                          }}
                          dragons={dragons}
                          disabled={!!trade}
                          label="Select Dragon"
                          description="Choose a dragon you're willing to trade"
                          placeholder="Choose a dragon to offer"
                          loading={loading}
                        />
                        
                        <NumberInput
                          value={dragon.orbs}
                          onChange={(value) =>
                            form.setFieldValue(
                              "canGiveDragons",
                              form.values.canGiveDragons.map((d, i) =>
                                i === index ? { ...d, orbs: Number(value) } : d
                              )
                            )
                          }
                          label="Number of Orbs"
                          description="How many orbs you can offer"
                          min={1}
                          max={1000}
                          styles={{ input: { height: 42 } }}
                        />
                      </SimpleGrid>
                      
                      <Box>
                        <Text size="sm" fw={500} mb={4}>Trade Ratio</Text>
                        <Ratio
                          left={dragon.ratioLeft}
                          right={dragon.ratioRight}
                          onLeftChange={(value) =>
                            form.setFieldValue(
                              "canGiveDragons",
                              form.values.canGiveDragons.map((d, i) =>
                                i === index ? { ...d, ratioLeft: value } : d
                              )
                            )
                          }
                          onRightChange={(value) =>
                            form.setFieldValue(
                              "canGiveDragons",
                              form.values.canGiveDragons.map((d, i) =>
                                i === index ? { ...d, ratioRight: value } : d
                              )
                            )
                          }
                        />
                      </Box>
                    </Stack>
                  </Card>
                ))}
                
                <Stack justify="center" mt="md">
                  <Button
                    leftSection={<IconPlus size={16} />}
                    variant="outline"
                    onClick={handleAddCanGive}
                    disabled={form.values.canGiveDragons.length >= 10 || !!trade}
                  >
                    Add Another Dragon to Offer
                  </Button>
                </Stack>
              </Stack>
            </Card>

            {/* Handle Essences Section */}
            <Card withBorder shadow="sm" p="md" radius="md">
              <Title order={3} size="h4" mb="md" c={theme.primaryColor}>
                Essence Handling
              </Title>
              <Select
                label="Who will handle the essences?"
                placeholder="Select an option"
                data={[
                  { value: 'YES', label: 'I will handle the essences (Poster Handles Essence)' },
                  { value: 'NO', label: 'Other trader handles essences (Requestor Handles Essence)' },
                  { value: 'SHARED', label: 'We will share the essences (Both Players Share Essence)' },
                ]}
                {...form.getInputProps('handleEssences')}
                mb="md"
              />
            </Card>
          </Stack>
        </ScrollArea>
        
        {/* Action Buttons */}
        <Group justify="flex-end" mt="md" p="md" style={{ borderTop: `1px solid ${theme.colors.gray[3]}` }}>
          <Button variant="light" onClick={onClose} size="md">
            Cancel
          </Button>
          <Button 
            type="submit" 
            size="md" 
            disabled={!form.isValid()}
            loading={form.submitting}
          >
            {trade ? 'Update Trade' : 'Create Trade'}
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default CreateUpdateTradeModal;
