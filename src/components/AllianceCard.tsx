// app/alliance-center/AllianceCard.tsx

"use client";

import { AllianceWithRequirements } from "@/services/alliances";
import { Card, Text, Button, Group, Badge, Title, Stack } from "@mantine/core";
import { sendGAEvent } from "@next/third-parties/google";
import { useState } from "react";

export default function AllianceCard({
  alliance,
}: {
  alliance: AllianceWithRequirements;
}) {
  const [showContact, setShowContact] = useState<boolean>(false);
  const handleContactClick = () => {
    sendGAEvent("event", "alliance_contact_clicked", {
      event_category: "Alliances",
      event_label: alliance.name,
      alliance_id: alliance.id,
    });
    // Open the contact link
    setShowContact(true);
  };

  return (
    <Card shadow="sm" w={280}>
      <Stack>
        <Title order={3}>{alliance.name}</Title>
        <Text size="sm" c="dimmed" h={72}>
          {alliance.description}
        </Text>
        <Title order={5}>Requirements</Title>
        <Text size="sm">
          Min Master Points: {alliance.requirements?.minMasterPoints ?? 0}
        </Text>
        <Text size="sm">
          {alliance.requirements?.discord
            ? "Requires Discord Communication"
            : "No Discord"}
        </Text>
        <Text size="sm">
          {alliance.requirements?.contribution
            ? "5% Alliance Chest Contribution Required"
            : "5% Alliance Chest Contribution Optional"}
        </Text>

        <Title order={5}>Tags</Title>
        <Group my="md" wrap="wrap" justify="start">
          {alliance.tags.map((tag) => (
            <Badge key={`${alliance.id}-${tag}`} variant="light" size="sm">
              {tag}
            </Badge>
          ))}
        </Group>
        {!showContact && <Button onClick={handleContactClick}>Contact</Button>}
        {showContact && (
          <>
            <Title order={5}>Contact Info</Title>
            <Text>{alliance.contact}</Text>
          </>
        )}
      </Stack>
    </Card>
  );
}
