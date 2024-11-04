import { RateDragons } from "@/services/dragons";
import { Card, Center, Group, Image } from "@mantine/core";
import NextImage from "next/image";
import Link from "next/link";
import { FC } from "react";
import ElementImage from "./ElementImage";
import RarityImage from "./RarityImage";
import FamilyImage from "./FamilyImage";
import SkinImage from "./SkinImage";

interface IDragonFaceCardProps {
  dragon: RateDragons[number];
}
const DragonFaceCard: FC<IDragonFaceCardProps> = ({ dragon }) => {
  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder>
      <Link href={`/dragon/${dragon.id}`}>
        <Card.Section>
          <Image
            component={NextImage}
            src={`https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui${dragon.thumbnail}`}
            alt={dragon.name}
            width={100}
            height={100}
            h={100}
            title={dragon.name}
          />
        </Card.Section>
        <Card.Section inheritPadding visibleFrom="sm">
          <Group justify="space-evenly" gap={4} py={4}>
            {dragon.elements.map((element, index) => (
              <ElementImage
                element={element}
                key={`${dragon.id}-${element}-${index}`}
              />
            ))}
          </Group>
          <Group justify="space-evenly" gap={4}>
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
        </Card.Section>
        <Card.Section hiddenFrom="sm">
          <Center>
            {dragon.isSkin && <SkinImage hasAllSkins={dragon.hasAllSkins} />}
          </Center>
        </Card.Section>
      </Link>
    </Card>
  );
};

export default DragonFaceCard;
