import { RarityNames } from "@/constants/Dragon";
import { Image } from "@mantine/core";
import { Rarity } from "@prisma/client";
import NextImage from "next/image";
import { FC } from "react";

interface IRarityImageProps {
  rarity: Rarity;
  width?: number;
  height?: number;
}

const RarityImage: FC<IRarityImageProps> = ({ rarity, width, height }) => {
  return (
    <Image
      component={NextImage}
      src={`/images/rarity/${rarity}.png`}
      alt={RarityNames[rarity]}
      title={RarityNames[rarity]}
      width={width ?? 32}
      height={height ?? 32}
      w={width ?? 32}
      h={height ?? 32}
    />
  );
};

export default RarityImage;
