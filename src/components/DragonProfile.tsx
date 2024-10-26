import { dragonWithSkillsAndRating } from "@/services/dragons";
import Image from "next/image";
import { FC } from "react";
import { Badge, Center, Group, Card, Stack } from "@mantine/core";
import RarityImage from "./RarityImage";
import ElementImage from "./ElementImage";
import SkinImage from "./SkinImage";

interface IDragonProfileProps {
  dragon: dragonWithSkillsAndRating;
}
const DragonProfile: FC<IDragonProfileProps> = ({ dragon }) => {
  return (
    <Stack>
      <div className="flex flex-row gap-2 items-start justify-center">
        <RarityImage rarity={dragon.rarity} height={40} />
        <div className="flex flex-row gap-1">
          {dragon.elements.map((element, index) => (
            <ElementImage
              element={element}
              key={`${dragon.id}-${element}-${index}`}
              height={40}
            />
          ))}
        </div>
        {dragon.isSkin && (
          <SkinImage hasAllSkins={dragon.hasAllSkins} height={40} />
        )}
      </div>
      <Center>
        <Image
          src={`https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui${dragon.image}`}
          alt={dragon.name}
          width={300}
          height={300}
        />
      </Center>
      <Group my="md" wrap="wrap" justify="center">
        {dragon.tags.map((tag) => (
          <Badge key={`${dragon.id}-${tag}`} variant="light" size="sm">
            {tag}
          </Badge>
        ))}
      </Group>
    </Stack>
  );
};

export default DragonProfile;
