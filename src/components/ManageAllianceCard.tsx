import { AllianceWithRequirements } from "@/services/alliances";
import { Card, Button, Group, Title, Switch } from "@mantine/core";

import { useState } from "react";

export default function ManageAllianceCard({
  alliance,
  openUpdateAllianceModal,
  onUpdateAlliance,
}: {
  alliance: AllianceWithRequirements;
  openUpdateAllianceModal: (alliance: AllianceWithRequirements) => void;
  onUpdateAlliance: (alliance: AllianceWithRequirements) => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const toggleAllianceRecruiting = async () => {
    setLoading(true);
    const response = await fetch(`/api/alliances/${alliance.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRecruiting: !alliance.isRecruiting }),
    });
    if (response.ok) {
      const updatedAlliance = await response.json();
      onUpdateAlliance(updatedAlliance);
    }
    setLoading(false);
  };
  return (
    <Card shadow="sm" w={280}>
      <Group>
        <Title order={3}>{alliance.name}</Title>
        <Switch
          checked={alliance.isRecruiting}
          onChange={toggleAllianceRecruiting}
          labelPosition="left"
          disabled={loading}
          label="Actively Recruiting?"
        />
        <Button onClick={() => openUpdateAllianceModal(alliance)}>
          Update other details
        </Button>
      </Group>
    </Card>
  );
}
