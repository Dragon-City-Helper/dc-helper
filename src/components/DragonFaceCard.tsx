import { RateDragons } from "@/services/dragons";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface IDragonFaceCardProps {
  dragon: RateDragons[number];
}
const DragonFaceCard: FC<IDragonFaceCardProps> = ({ dragon }) => {
  return (
    <div className="h-full border-2 border-gray-100">
      <Link href={`/dragons/${dragon.id}`}>
        <figure>
          <Image
            src={`https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui${dragon.thumbnail}`}
            alt={dragon.name}
            width={100}
            height={100}
            title={dragon.name}
          />
        </figure>
        <div className="text-center items-center">
          <div className="flex flex-row gap-1 justify-evenly">
            {dragon.elements.map((element, index) => (
              <Image
                key={`${dragon.id}-${element}-${index}`}
                src={`/images/elements/${element}.png`}
                alt={element}
                width={15}
                height={31}
              />
            ))}
          </div>
          <div className="flex flex-row gap-2 items-start justify-start">
            <Image
              src={`/images/rarity/${dragon.rarity}.png`}
              alt={dragon.rarity}
              width={32}
              height={32}
            />

            {dragon.familyName && (
              <Image
                src={`/images/family/icon-${dragon.familyName}.png`}
                alt={dragon.familyName}
                width={32}
                height={32}
              />
            )}
            {dragon.isSkin && (
              <Image
                src="/images/skin.png"
                alt={dragon.name}
                width={32}
                height={32}
              />
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default DragonFaceCard;
