import { fullDragon } from "@/services/dragons";
import Image from "next/image";
import { FC } from "react";
import { Badge, Center, Group, Box } from "@mantine/core";
import RarityImage from "./RarityImage";
import ElementImage from "./ElementImage";
import SkinImage from "./SkinImage";
import FamilyImage from "./FamilyImage";
import DragonPerks from "./DragonPerks";

interface IDragonProfileProps {
  dragon: fullDragon;
}
const DragonProfile: FC<IDragonProfileProps> = ({ dragon }) => {
  return (
    <Box>
      <Center>
        <Group>
          <RarityImage rarity={dragon.rarity} height={40} />
          {dragon.elements.map((element, index) => (
            <ElementImage
              element={element}
              key={`${dragon.id}-${element}-${index}`}
              height={40}
            />
          ))}
          {dragon.familyName && <FamilyImage familyName={dragon.familyName} />}
          {dragon.isSkin && (
            <SkinImage hasAllSkins={dragon.hasAllSkins} height={40} />
          )}
        </Group>
      </Center>
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
      <DragonPerks dragon={dragon} />
    </Box>
  );
};

export default DragonProfile;
