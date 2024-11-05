import { HomeDragons, RateDragons } from "@/services/dragons";
import { Drawer, Group, NavLink, Text, Title } from "@mantine/core";
import DragonPanelContent from "./DragonPanelContent";
import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";

export default function DragonPanel({
  dragon,
  opened,
  close,
}: {
  dragon?: RateDragons[number] | HomeDragons[number];
  opened: boolean;
  close: any;
}) {
  return (
    <Drawer
      opened={opened}
      onClose={close}
      size="100%"
      position="right"
      title={<Title order={2}>{dragon?.name || ""}</Title>}
    >
      {dragon?.id && (
        <>
          <DragonPanelContent id={dragon.id} />
          <Group justify="flex-end">
            <NavLink
              component={Link}
              href={`/dragon/${dragon.id}`}
              label={
                <Text className="underline">Learn more about this dragon </Text>
              }
              rightSection={<IconChevronRight />}
              w={280}
            />
          </Group>
        </>
      )}
    </Drawer>
  );
}
