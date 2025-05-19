import { TradeDragons } from "@/services/dragons";
import { Box, Card, Image } from "@mantine/core";
import { FC } from "react";
import FamilyImage from "./FamilyImage";
import { RarityColors } from "@/constants/Dragon";

interface ITradeDragonFaceCardProps {
  dragon: TradeDragons[number] & {
    skillType: number | null;
  };
  size?: "xs" | "sm" | "md" | "lg";
  style?: React.CSSProperties;
}

const sizeMap = {
  xs: { card: 50, icon: 16 },
  sm: { card: 80, icon: 32 },
  md: { card: 100, icon: 48 },
  lg: { card: 120, icon: 64 },
};

const TradeDragonFaceCard: FC<ITradeDragonFaceCardProps> = ({
  dragon,
  size = "sm",
  style,
}) => {
  const { card: cardSize, icon: iconSize } = sizeMap[size];

  return (
    <Box style={{ position: "relative", display: "inline-block", ...style }}>
      <Card
        p={0}
        withBorder
        radius="md"
        style={{
          width: cardSize,
          height: cardSize,
          border: `3px solid ${RarityColors[dragon.rarity]}`,
          padding: 0,
          overflow: "hidden",
        }}
      >
        <Card.Section>
          <Image
            src={`https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui${dragon.thumbnail}`}
            alt={dragon.name}
            width={cardSize}
            height={cardSize}
            fit="contain"
            style={{
              padding: "4px",
              boxSizing: "border-box",
            }}
          />
        </Card.Section>
      </Card>

      <Box
        style={{
          position: "absolute",
          top: 4,
          left: 4,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {dragon.familyName && (
          <FamilyImage
            familyName={dragon.familyName}
            width={iconSize / 2}
            height={iconSize / 2}
          />
        )}
        {!dragon.isVip && dragon.hasSkills && dragon.skillType !== null && (
          <Image
            src={`/images/skilltype/${dragon.skillType}.png`}
            alt="skill"
            w={iconSize / 2 - 4}
            h={iconSize / 2 - 4}
          />
        )}
      </Box>
    </Box>
  );
};

export default TradeDragonFaceCard;
