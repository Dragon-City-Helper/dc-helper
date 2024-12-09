import { AllianceWithRequirements } from "@/services/alliances";
import {
  Button,
  Checkbox,
  Modal,
  NumberInput,
  Stack,
  TagsInput,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function CreateUpdateAllianceModal({
  opened,
  onClose,
  onCreateAlliance,
  onUpdateAlliance,
  alliance,
}: {
  opened: boolean;
  onClose: () => void;
  onCreateAlliance: (alliance: any) => void;
  onUpdateAlliance: (alliance: any) => void;
  alliance?: AllianceWithRequirements;
}) {
  const [tagsOptions, setTagsOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const isUpdateMode = useMemo(() => !!alliance, [alliance]);
  async function fetchTags() {
    try {
      const response = await fetch("/api/alliances/tags");
      const result = await response.json();
      if (response.ok) {
        const tags = result.tags.map((tag: string) => ({
          value: tag,
          label: tag,
        }));
        setTagsOptions(tags);
      } else {
        console.error("Error fetching tags:", result.error);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  }

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    if (alliance) {
      form.setValues({
        name: alliance.name,
        description: alliance.description,
        tags: alliance.tags,
        isSponsored: alliance.isSponsored,
        isRecruiting: alliance.isRecruiting,
        openSpots: alliance.openSpots,
        contact: alliance.contact,
        requirements: {
          minMasterPoints: alliance.requirements.minMasterPoints,
          discord: alliance.requirements.discord,
          contribution: alliance.requirements.contribution,
          other: alliance.requirements.other,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alliance]);

  // Form for creating alliance
  const form = useForm({
    initialValues: alliance
      ? {
          name: alliance.name,
          description: alliance.description,
          tags: alliance.tags,
          isSponsored: alliance.isSponsored,
          isRecruiting: alliance.isRecruiting,
          openSpots: alliance.openSpots,
          contact: alliance.contact,
          requirements: {
            minMasterPoints: alliance.requirements.minMasterPoints,
            discord: alliance.requirements.discord,
            contribution: alliance.requirements.contribution,
            other: alliance.requirements.other,
          },
        }
      : {
          name: "",
          description: "",
          tags: [],
          isSponsored: false,
          isRecruiting: true,
          openSpots: 1,
          contact: "",
          requirements: {
            minMasterPoints: 0,
            discord: false,
            contribution: false,
            other: "",
          },
        },
    validate: {
      name: (value) => (value ? null : "Name is required"),
      contact: (value) => (value ? null : "Contact Info is required"),
    },
  });

  // Handle form submission
  const handleSubmit = useCallback(
    async (values: any) => {
      if (isUpdateMode && !!alliance) {
        try {
          const response = await fetch(`/api/alliances/${alliance.id}}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });

          if (response.ok) {
            const updatedAlliance = await response.json();
            onUpdateAlliance(updatedAlliance);
            form.reset();
            onClose();
          } else {
            const errorData = await response.json();
            form.setErrors({ api: errorData.error });
          }
        } catch (error) {
          console.error("Error Updating alliance:", error);
          form.setErrors({ api: "Failed to update alliance" });
        }
      } else {
        try {
          const response = await fetch("/api/alliances", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });

          if (response.ok) {
            const newAlliance = await response.json();
            onCreateAlliance(newAlliance);
            form.reset();
            onClose();
          } else {
            const errorData = await response.json();
            form.setErrors({ api: errorData.error });
          }
        } catch (error) {
          console.error("Error creating alliance:", error);
          form.setErrors({ api: "Failed to create alliance" });
        }
      }
    },
    [alliance, form, isUpdateMode, onClose, onCreateAlliance, onUpdateAlliance]
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isUpdateMode ? `Update ${alliance?.name}` : "Create Alliance"}
      size="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Alliance Name"
            disabled={isUpdateMode}
            {...form.getInputProps("name")}
            required
          />
          <Textarea
            label="Description"
            {...form.getInputProps("description")}
          />
          <TagsInput
            label="Tags"
            maxTags={5}
            data={tagsOptions}
            {...form.getInputProps("tags")}
            placeholder="Select or Create upto 5 Tags"
          />

          <NumberInput
            label="Open Spots"
            {...form.getInputProps("openSpots")}
            min={0}
          />
          <TextInput
            label="Contact"
            placeholder="e.g. Contact ABC on discord"
            {...form.getInputProps("contact")}
            required
          />
          <Title order={3}>Requirements</Title>
          <NumberInput
            label="Minimum Master Points"
            step={1000}
            {...form.getInputProps("requirements.minMasterPoints")}
            min={0}
          />
          <Checkbox
            label="Discord Required ?"
            {...form.getInputProps("requirements.discord", {
              type: "checkbox",
            })}
          />
          <Checkbox
            label="5% Contribution Required ?"
            {...form.getInputProps("requirements.contribution", {
              type: "checkbox",
            })}
          />
          <Textarea
            label="Other Requirements"
            {...form.getInputProps("requirements.other")}
          />
          <Checkbox
            label="Actively Recruiting ?"
            description="You can turn this off at a later point of time"
            {...form.getInputProps("isRecruiting", { type: "checkbox" })}
          />
          {form.errors.api && (
            <Text c="red" size="sm">
              {form.errors.api}
            </Text>
          )}
        </Stack>
        <Button type="submit" mt="md">
          {isUpdateMode ? "Update Alliance" : "Create Alliance"}
        </Button>
      </form>
    </Modal>
  );
}
