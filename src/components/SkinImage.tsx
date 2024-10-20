import { Image } from "@mantine/core";
import NextImage from "next/image";
import { FC } from "react";

interface ISkinImageProps {
  hasAllSkins: boolean;
  width?: number;
  height?: number;
}

const SkinImage: FC<ISkinImageProps> = ({ hasAllSkins, width, height }) => {
  return (
    <Image
      component={NextImage}
      src={`/images/${hasAllSkins ? "all-skins" : "skin"}.png`}
      alt={`${hasAllSkins ? "all skins icon" : "skins icon"}`}
      title={`${hasAllSkins ? "all skins icon" : "skins icon"}`}
      width={width ?? 32}
      height={height ?? 32}
      w={width ?? 32}
      h={height ?? 32}
    />
  );
};

export default SkinImage;
