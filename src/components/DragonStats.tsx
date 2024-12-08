"use client";
import { fullDragon } from "@/services/dragons";
import { Stack, Title, Card, Group, Image } from "@mantine/core";
import NextImage from "next/image";

import { FC } from "react";

interface IDragonStatsProps {
  dragon: fullDragon;
}

const DragonStats: FC<IDragonStatsProps> = ({ dragon }) => {
  return (
    <Card>
      <Stack>
        <Title order={3}>Base Stats</Title>
        <Group wrap="wrap" align="center" justify="space-between">
          <Group>
            <Image
              component={NextImage}
              src={`/images/health.png`}
              alt="Health"
              title="Health"
              width={32}
              height={32}
              w={32}
              h={32}
              fit="contain"
            />
            {dragon.baseLife}
          </Group>
          <Group>
            <Image
              component={NextImage}
              src={`/images/damage.png`}
              alt="Health"
              title="Health"
              width={32}
              height={32}
              w={32}
              h={32}
              fit="contain"
            />
            {dragon.baseAttack}
          </Group>
          <Group>
            <Image
              component={NextImage}
              src={`/images/speed.png`}
              alt="Health"
              title="Health"
              width={32}
              height={32}
              w={32}
              h={32}
              fit="contain"
            />
            {dragon.baseSpeed} - {dragon.maxSpeed}
          </Group>
        </Group>
      </Stack>
    </Card>
  );
};

export default DragonStats;
