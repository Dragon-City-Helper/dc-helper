import { BaseDragons } from "@/services/dragons";
import { Box, Card, Center, Group, Image } from "@mantine/core";
import NextImage from "next/image";
import { FC } from "react";
import ElementImage from "./ElementImage";
import RarityImage from "./RarityImage";
import FamilyImage from "./FamilyImage";
import SkinImage from "./SkinImage";
import { RarityColors } from "@/constants/Dragon";

interface IDragonFaceCardProps {
  dragon: BaseDragons[number];
  onDragonClick?: (dragon: BaseDragons[number]) => void;
}

const DragonFaceCard: FC<IDragonFaceCardProps> = ({
  dragon,
  onDragonClick,
}) => {
  return (
    <Box className="relative">
      <Card
        shadow="sm"
        padding="0"
        radius="md"
        withBorder
        bd={`4px solid ${RarityColors[dragon.rarity]}`}
        className="cursor-pointer "
        onClick={() => onDragonClick && onDragonClick(dragon)}
      >
        <Card.Section>
          <Image
            component={NextImage}
            src={`https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui${dragon.thumbnail}`}
            alt={dragon.name}
            width={100}
            height={100}
            title={dragon.name}
          />
        </Card.Section>
      </Card>
      <Box className="absolute -left-0 top-1 ">
        {dragon.familyName && <FamilyImage familyName={dragon.familyName} />}
        {!dragon.isSkin && !dragon.isVip && dragon.hasSkills ? (
          <NextImage
            src={`/images/skilltype/${dragon.skillType}.png`}
            alt={dragon.rarity}
            width={32}
            height={32}
          />
        ) : null}
      </Box>
      <Box className="absolute -right-0 top-1">
        {dragon.isSkin && <SkinImage hasAllSkins={dragon.hasAllSkins} />}
      </Box>
    </Box>
  );
};

export default DragonFaceCard;
