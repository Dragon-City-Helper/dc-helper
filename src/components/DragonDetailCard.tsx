import { HomeDragons } from "@/services/dragons";
import { Badge, Card, Center, Group, Image, Stack, Text } from "@mantine/core";
import NextImage from "next/image";
import Link from "next/link";
import { FC, PropsWithChildren } from "react";
import ElementImage from "./ElementImage";
import RarityImage from "./RarityImage";
import FamilyImage from "./FamilyImage";
import SkinImage from "./SkinImage";
import RatingBadge from "./RatingBadge";

interface IDragonDetailCardProps {
  dragon: HomeDragons[number];
}
const DragonDetailCard: FC<PropsWithChildren<IDragonDetailCardProps>> = ({
  dragon,
  children,
}) => {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Card.Section h={100}>
        <Link href={`/dragon/${dragon.id}`}>
          <Text ta="center" mt="md" mb="xs" fz="sm" fw="bold">
            {dragon.name}
          </Text>
        </Link>
      </Card.Section>
      <Card.Section h={130}>
        <Link href={`/dragon/${dragon.id}`}>
          <Center>
            <Image
              component={NextImage}
              src={`https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui${dragon.image}`}
              alt={dragon.name}
              width={100}
              height={100}
              fit="contain"
              title={dragon.name}
            />
          </Center>
        </Link>
      </Card.Section>
      <Card.Section inheritPadding>
        <Stack justify="space-between">
          <Group justify="space-evenly" gap={4} my="sm" visibleFrom="sm">
            {dragon.elements.map((element, index) => (
              <ElementImage
                element={element}
                key={`${dragon.id}-${element}-${index}`}
              />
            ))}
            <RarityImage rarity={dragon.rarity} />
            {dragon.familyName && (
              <FamilyImage familyName={dragon.familyName} />
            )}
            {dragon.isSkin && <SkinImage hasAllSkins={dragon.hasAllSkins} />}
            {!dragon.isSkin && !dragon.isVip && dragon.hasSkills ? (
              <NextImage
                src={`/images/skilltype/${dragon.skillType}.png`}
                alt={dragon.rarity}
                width={32}
                height={32}
              />
            ) : null}
          </Group>
          <Group className="justify-center sm:justify-between mt-4 sm:mt-0">
            <Text visibleFrom="sm"> Rating </Text>
            <RatingBadge rating={dragon.rating?.overall} />
          </Group>
          <Group my="sm" justify="space-evenly" className="h-36 sm:h-28">
            {dragon.tags
              .sort((a, b) => b.length - a.length)
              .map((tag) => (
                <Badge key={`${dragon.id}-${tag}`} variant="light">
                  {tag}
                </Badge>
              ))}
          </Group>
        </Stack>
      </Card.Section>
      <Card.Section inheritPadding>{children}</Card.Section>
    </Card>
  );
};

export default DragonDetailCard;
