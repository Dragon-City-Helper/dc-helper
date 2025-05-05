import { TradeDragons } from "@/services/dragons";
import { Box, Card, Image } from "@mantine/core";
import NextImage from "next/image";
import { FC } from "react";
import FamilyImage from "./FamilyImage";
import { RarityColors } from "@/constants/Dragon";

interface ITradeDragonFaceCardProps {
  dragon: TradeDragons[number] & {
    skillType: number | null;
  };
  size?: "xs" | "sm" | "md" | "lg";
}

const TradeDragonFaceCard: FC<ITradeDragonFaceCardProps> = ({
  dragon,
  size = "sm",
}) => {
  const sizes = {
    xs: { width: 50, height: 50, iconSize: 16 },
    sm: { width: 100, height: 100, iconSize: 32 },
    md: { width: 200, height: 200, iconSize: 48 },
    lg: { width: 300, height: 300, iconSize: 64 },
  };

  const currentSize = sizes[size || "sm"];
  return (
    <Box className="relative">
      <Card
        shadow="sm"
        padding="0"
        radius="md"
        withBorder
        bd={`4px solid ${RarityColors[dragon.rarity]}`}
        w={currentSize.width}
        h={currentSize.height}
        className="cursor-pointer box-content "
      >
        <Card.Section>
          <Image
            component={NextImage}
            src={`https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui${dragon.thumbnail}`}
            alt={dragon.name}
            width={currentSize.width}
            height={currentSize.height}
            w={currentSize.width}
            h={currentSize.height}
            title={dragon.name}
          />
        </Card.Section>
      </Card>
      <Box className="absolute -left-0 top-1 ">
        {dragon.familyName && (
          <FamilyImage
            familyName={dragon.familyName}
            width={currentSize.iconSize}
            height={currentSize.iconSize}
          />
        )}
        {!dragon.isVip && dragon.hasSkills ? (
          <NextImage
            src={`/images/skilltype/${dragon.skillType}.png`}
            alt={"skill"}
            width={currentSize.iconSize}
            height={currentSize.iconSize}
          />
        ) : null}
      </Box>
    </Box>
  );
};

export default TradeDragonFaceCard;
