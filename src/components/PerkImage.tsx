import { PerkNames, RarityNames } from "@/constants/Dragon";
import { Image } from "@mantine/core";
import { Perk } from "@prisma/client";
import NextImage from "next/image";
import { FC } from "react";

interface IPerkImageProps {
  perk: Perk;
  width?: number;
  height?: number;
}

const PerkImage: FC<IPerkImageProps> = ({ perk, width, height }) => {
  return (
    <Image
      component={NextImage}
      src={`/images/perks/${perk}.png`}
      alt={PerkNames[perk]}
      title={PerkNames[perk]}
      width={width ?? 32}
      height={height ?? 32}
      w={width ?? 32}
      h={height ?? 32}
      fit="contain"
    />
  );
};

export default PerkImage;
