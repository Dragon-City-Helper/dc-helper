"use client";

import DragonDetailCard from "@/components/DragonDetailCard";
import ElementImage from "@/components/ElementImage";
import FamilyImage from "@/components/FamilyImage";
import RarityImage from "@/components/RarityImage";
import { elements, ElementsNames, RarityNames } from "@/constants/Dragon";
import { BaseDragons } from "@/services/dragons";
import {
  Card,
  Table,
  Text,
  Title,
  Accordion,
  Group,
  Badge,
  AccordionItem,
  AccordionPanel,
  AccordionControl,
  SimpleGrid,
  Tabs,
} from "@mantine/core";
import { Elements, Rarity } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Stats = {
  totalOwnedDragons: number;
  rarityCounts: Record<string, { dragons: number; skins: number }>;
  elementCounts: Record<string, { dragons: number; skins: number }>;
  vipCounts: { dragons: number; skins: number };
  skinCount: number;
  familyCounts: Record<string, { dragons: number; skins: number }>;
  topRatedDragonsByElement: Record<Elements, BaseDragons>;
};

const DragonDashboard = ({ stats }: { stats: Stats }) => {
  const {
    totalOwnedDragons,
    rarityCounts,
    elementCounts,
    vipCounts,
    skinCount,
    familyCounts,
    topRatedDragonsByElement,
  } = stats;
  const { refresh } = useRouter();

  //  this is to force api calls post router loads it.
  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div>
      <Title order={2} mb="lg">
        Dragon Dashboard
      </Title>

      {/* Summary Cards */}
      <SimpleGrid cols={{ base: 2, md: 4 }}>
        <Card shadow="sm" padding="lg">
          <Text>Dragons Owned</Text>
          <Title order={3}>{totalOwnedDragons}</Title>
        </Card>
        <Card shadow="sm" padding="lg">
          <Text>Skins Owned</Text>
          <Title order={3}>{skinCount}</Title>
        </Card>
        <Card shadow="sm" padding="lg">
          <Text>VIP Dragons</Text>
          <Title order={3}>{vipCounts.dragons}</Title>
        </Card>
        <Card shadow="sm" padding="lg">
          <Text>VIP Skins</Text>
          <Title order={3}>{vipCounts.skins}</Title>
        </Card>
      </SimpleGrid>

      {/* Accordion for detailed stats */}
      <Accordion mt="xl" variant="contained">
        {/* Top Rated Dragons */}
        <AccordionItem value="Top Rated Dragons">
          <AccordionControl>Your Top Rated Dragons</AccordionControl>
          <AccordionPanel>
            <Tabs defaultValue={elements[0]}>
              <Tabs.List>
                {elements.map((element) => (
                  <Tabs.Tab
                    key={`${element}-top-owned-dragons-tab`}
                    value={element}
                  >
                    <Group>
                      <ElementImage element={element} />
                      <Text>{ElementsNames[element]}</Text>
                    </Group>
                  </Tabs.Tab>
                ))}
              </Tabs.List>

              {Object.entries(topRatedDragonsByElement).map(
                ([element, dragons]) => {
                  return (
                    <Tabs.Panel
                      value={element}
                      key={`${element}-top-owned-dragons-tab-panel`}
                    >
                      <Title order={3} my="md">
                        Top {ElementsNames[element as Elements]} Dragons
                      </Title>
                      <SimpleGrid cols={{ base: 2, md: 3 }}>
                        {dragons.map((dragon) => (
                          <DragonDetailCard dragon={dragon} key={dragon.id} />
                        ))}
                      </SimpleGrid>
                    </Tabs.Panel>
                  );
                }
              )}
            </Tabs>
          </AccordionPanel>
        </AccordionItem>

        {/* Dragons by Rarity */}
        <AccordionItem value="Dragons by Rarity">
          <AccordionControl>Dragons by Rarity</AccordionControl>
          <AccordionPanel>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Rarity</Table.Th>
                  <Table.Th>Dragons</Table.Th>
                  <Table.Th>Skins</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {Object.entries(rarityCounts).map(([rarity, counts]) => (
                  <Table.Tr key={rarity}>
                    <Table.Td>
                      <Group align="center">
                        <RarityImage rarity={rarity as Rarity} />
                        <Text>{RarityNames[rarity as Rarity]}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>{counts.dragons}</Table.Td>
                    <Table.Td>{counts.skins}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </AccordionPanel>
        </AccordionItem>

        {/* Dragons by Element */}
        <AccordionItem value="Dragons by Element">
          <AccordionControl>Dragons by Element</AccordionControl>
          <AccordionPanel>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Element</Table.Th>
                  <Table.Th>Dragons</Table.Th>
                  <Table.Th>Skins</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {Object.entries(elementCounts).map(([element, counts]) => (
                  <Table.Tr key={element}>
                    <Table.Td>
                      <Group align="center">
                        <ElementImage element={element as Elements} />
                        <Text>{ElementsNames[element as Elements]}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>{counts.dragons}</Table.Td>
                    <Table.Td>{counts.skins}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </AccordionPanel>
        </AccordionItem>

        {/* Dragons by Family */}
        <AccordionItem value="Dragons by Family">
          <AccordionControl>Dragons by Family</AccordionControl>
          <AccordionPanel>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Family</Table.Th>
                  <Table.Th>Dragons</Table.Th>
                  <Table.Th>Skins</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {Object.entries(familyCounts).map(([family, counts]) => (
                  <Table.Tr key={family}>
                    <Table.Td>
                      <Group align="center">
                        <FamilyImage familyName={family} />
                        <Text>{family}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>{counts.dragons}</Table.Td>
                    <Table.Td>{counts.skins}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default DragonDashboard;
