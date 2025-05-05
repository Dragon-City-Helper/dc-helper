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
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { IconPlus } from "@tabler/icons-react";
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
            orbs: 1,
          },
          canGiveDragons: [
            {
              dragonId: "",
              orbs: 1,
              ratioLeft: 1,
              ratioRight: 1,
            },
          ],
          isVisible: true,
          isSponsored: false,
          handleEssences: "NO" as HandleEssences,
          isDeleted: false,
        },
    validate: {
      lookingFor: {
        dragonId: (value: string) =>
          value === "" ? "Please select a dragon" : null,
        orbs: (value: number) => (value < 1 ? "Orbs must be at least 1" : null),
      },
      canGiveDragons: (
        value: {
          dragonId: string;
          orbs: number;
          ratioLeft: number;
          ratioRight: number;
        }[]
      ) => {
        if (value.length === 0) {
          return "At least one dragon is required";
        }
        for (let i = 0; i < value.length; i++) {
          if (value[i].dragonId === "") {
            return `Please select a dragon for canGiveDragons[${i}]`;
          }
          if (value[i].orbs < 1) {
            return `Orbs for canGiveDragons[${i}] must be at least 1`;
          }
          if (value[i].ratioLeft < 1) {
            return `Ratio left for canGiveDragons[${i}] must be at least 1`;
          }
          if (value[i].ratioRight < 1) {
            return `Ratio right for canGiveDragons[${i}] must be at least 1`;
          }
        }
        return null;
      },
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
      const tradeData = {
        lookingForDragon: {
          dragonId: values.lookingFor.dragonId,
          orbs: values.lookingFor.orbs,
        },
        canGiveDragons: values.canGiveDragons,
      };

      const data = await createTradeApi(tradeData);
      onSubmit(data);
      form.reset();
      onClose();
      notify({
        title: "Success",
        message: "Trade created successfully",
        color: "green",
      });
    } catch (error) {
      console.error("Error creating trade:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred while creating the trade");
      }
      notify({
        title: "Error",
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while creating the trade",
        color: "red",
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

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Create or Update Trade"
      size="xl"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        {error && (
          <Alert title="Error" color="red" mb="md">
            {error}
          </Alert>
        )}
        <Stack>
          <DragonSelect
            value={form.values.lookingFor.dragonId}
            onChange={(value) =>
              form.setFieldValue("lookingFor.dragonId", value ?? "")
            }
            dragons={dragons}
            label="Looking for"
            placeholder="Select dragon"
            loading={loading}
          />
          <NumberInput
            value={form.values.lookingFor.orbs}
            onChange={(value) =>
              form.setFieldValue("lookingFor.orbs", Number(value))
            }
            label="Orbs"
            min={1}
            max={1000}
          />
          <Divider />
          <>
            {form.values.canGiveDragons.map((dragon, index) => (
              <div key={dragon.dragonId}>
                <Stack>
                  <DragonSelect
                    value={dragon.dragonId}
                    onChange={(value) =>
                      form.setFieldValue(
                        "canGiveDragons",
                        form.values.canGiveDragons.map((d, i) =>
                          i === index ? { ...d, dragonId: value ?? "" } : d
                        )
                      )
                    }
                    dragons={dragons}
                    label="Can Give"
                    placeholder="Select dragon"
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
                    label="Orbs"
                    min={1}
                    max={1000}
                  />
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
                    label="Ratio"
                  />
                  <Group>
                    <Button
                      variant="outline"
                      color="red"
                      onClick={() =>
                        form.setFieldValue(
                          "canGiveDragons",
                          form.values.canGiveDragons.map((d, i) =>
                            i === index ? { ...d, dragonId: "" } : d
                          )
                        )
                      }
                    >
                      Remove
                    </Button>
                  </Group>
                </Stack>
              </div>
            ))}
          </>
          <Button
            variant="outline"
            leftSection={<IconPlus size={16} />}
            onClick={handleAddCanGive}
          >
            Add Another Dragon
          </Button>
          <Button type="submit">Create Trade</Button>
        </Stack>
      </form>
    </Modal>
  );
};

export default CreateUpdateTradeModal;
