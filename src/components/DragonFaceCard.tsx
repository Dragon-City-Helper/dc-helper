import { getRatingText } from "@/constants/Rating";
import { dragonsWithRating } from "@/services/dragons";
import Image from "next/image";
import { FC } from "react";

interface IDragonFaceCardProps {
  dragon: dragonsWithRating[number];
}
const DragonFaceCard: FC<IDragonFaceCardProps> = ({ dragon }) => {
  return (
    <div className="card bg-base-100 w-80 shadow-xl">
      <figure>
        <Image src={dragon.image} alt={dragon.name} width={100} height={100} />
      </figure>
      <div className="card-body text-center items-center">
        <h2 className="card-title">{dragon.name}</h2>
        <div className="flex flex-row gap-2 items-start justify-between">
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
          <div className="flex flex-row gap-1">
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
          <div className="avatar placeholder">
            <div className="bg-primary text-neutral-content w-8 rounded-full">
              <span> {dragon?.rating?.score || 0}</span>
            </div>
          </div>
          <div className="avatar placeholder">
            <div className="bg-secondary text-neutral-content w-8 rounded-full">
              <span> {getRatingText(dragon?.rating?.overall || 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DragonFaceCard;
