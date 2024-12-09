"use client";

import ManageAllianceCard from "@/components/ManageAllianceCard";
import CreateUpdateAllianceModal from "@/components/CreateUpdateAllianceModal";
import { Alliances, AllianceWithRequirements } from "@/services/alliances";
import { Button, Center, Container, Group, Stack, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Session } from "next-auth";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";

const ManageAlliances: FC<{
  alliances: Alliances;
  session: Session;
}> = ({ alliances = [], session }) => {
  const [opened, { close, open }] = useDisclosure(false);
  const [selectedAlliance, setSelectedAlliance] =
    useState<AllianceWithRequirements>();
  const router = useRouter();

  const onCreateAlliance = (alliance: AllianceWithRequirements) => {};
  const onUpdateAlliance = (alliance: AllianceWithRequirements) => {
    router.refresh();
  };
  const openUpdateAllianceModal = (alliance: AllianceWithRequirements) => {
    setSelectedAlliance(alliance);
    open();
  };
  const openCreateAllianceModal = () => {
    setSelectedAlliance(undefined);
    open();
  };
  return (
    <Container>
      <Stack>
        <Group justify="space-between" grow>
          <Title>Manage Alliances</Title>
        </Group>
        <Center>
          {alliances.length > 0 ? (
            <Group wrap="wrap" align="start">
              {alliances.map((alliance) => (
                <ManageAllianceCard
                  key={alliance.id}
                  alliance={alliance}
                  onUpdateAlliance={onUpdateAlliance}
                  openUpdateAllianceModal={openUpdateAllianceModal}
                />
              ))}
            </Group>
          ) : (
            <Button onClick={openCreateAllianceModal}>
              Advertise Your Alliance
            </Button>
          )}
        </Center>
      </Stack>
      <CreateUpdateAllianceModal
        opened={opened}
        onClose={close}
        alliance={selectedAlliance}
        onCreateAlliance={onCreateAlliance}
        onUpdateAlliance={onUpdateAlliance}
      />
    </Container>
  );
};

export default ManageAlliances;
