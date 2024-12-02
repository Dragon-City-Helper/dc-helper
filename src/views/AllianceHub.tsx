"use client";

import AllianceCard from "@/components/AllianceCard";
import { Alliances } from "@/services/alliances";
import { Center, Container, Group, Stack, Title } from "@mantine/core";
import { useState } from "react";

export default function AllianceHub({
  initialAlliances = [],
}: {
  initialAlliances: Alliances;
}) {
  const [alliances, setAlliances] = useState<any[]>(initialAlliances);

  return (
    <Container>
      <Stack>
        <Group justify="space-between" grow>
          <Title>Alliance Hub</Title>
        </Group>
        <Center>
          <Group wrap="wrap" align="start">
            {alliances?.map((alliance) => (
              <AllianceCard key={alliance.id} alliance={alliance} />
            ))}
          </Group>
        </Center>
      </Stack>
    </Container>
  );
}
