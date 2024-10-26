import { Image } from "@mantine/core";
import NextImage from "next/image";
import { FC } from "react";

interface IElementImageProps {
  familyName: string;
  width?: number;
  height?: number;
}

const FamilyImage: FC<IElementImageProps> = ({ familyName, width, height }) => {
  return (
    <Image
      component={NextImage}
      src={`/images/family/icon-${familyName}.png`}
      alt={familyName}
      title={familyName}
      width={width ?? 32}
      height={height ?? 32}
      w={width ?? 32}
      h={height ?? 32}
      fit="contain"
    />
  );
};

export default FamilyImage;
