import { HomeDragons } from "@/services/dragons";
import { Badge, Card, Center, Group, Image, Text } from "@mantine/core";
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
      <Card.Section h={250}>
        <Link href={`/dragon/${dragon.id}`}>
          <Text ta="center" mt="md" mb="xs" fz="sm" fw="bold" h={50}>
            {dragon.name}
          </Text>
          <Center>
            <Image
              component={NextImage}
              src={`https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui${dragon.image}`}
              alt={dragon.name}
              width={100}
              height={100}
              w={175}
              h={175}
              fit="fill"
              title={dragon.name}
            />
          </Center>
        </Link>
      </Card.Section>
      <Group justify="space-evenly" gap={4} my="md">
        {dragon.elements.map((element, index) => (
          <ElementImage
            element={element}
            key={`${dragon.id}-${element}-${index}`}
          />
        ))}
        <RarityImage rarity={dragon.rarity} />
        {dragon.familyName && <FamilyImage familyName={dragon.familyName} />}
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
      <Group justify="space-between">
        <Text> Rating </Text>
        <RatingBadge rating={dragon.rating?.overall} />
      </Group>
      <Group my="md" gap="sm" h={72}>
        {dragon.tags.map((tag) => (
          <Badge key={`${dragon.id}-${tag}`} variant="light" size="sm">
            {tag}
          </Badge>
        ))}
      </Group>
      <Card.Section inheritPadding>{children}</Card.Section>
    </Card>
  );
};

export default DragonDetailCard;
