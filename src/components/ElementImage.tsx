import { ElementsNames } from "@/constants/Dragon";
import { Image } from "@mantine/core";
import { Elements } from "@prisma/client";
import NextImage from "next/image";
import { FC } from "react";

interface IElementImageProps {
  element: Elements;
  width?: number;
  height?: number;
}

const ElementImage: FC<IElementImageProps> = ({ element, width, height }) => {
  return (
    <Image
      component={NextImage}
      src={`/images/elements/${element}.png`}
      alt={ElementsNames[element]}
      title={ElementsNames[element]}
      width={width ?? 16}
      height={height ?? 32}
      w={width ?? 16}
      h={height ?? 32}
      fit="contain"
    />
  );
};

export default ElementImage;
