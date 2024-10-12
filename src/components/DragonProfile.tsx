import { getRatingText } from "@/constants/Rating";
import { dragonWithSkillsAndRating } from "@/services/dragons";
import Image from "next/image";
import { FC } from "react";

interface IDragonProfileProps {
  dragon: dragonWithSkillsAndRating;
}
const DragonProfile: FC<IDragonProfileProps> = ({ dragon }) => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex justify-between items-center border border-gray-200 p-2 rounded-box">
        <div>{dragon.name}</div>
        {dragon.familyName && (
          <Image
            src={`/images/family/icon-${dragon.familyName}.png`}
            alt={dragon.familyName}
            width={32}
            height={32}
          />
        )}
      </div>
      <div className="flex flex-row gap-2 items-start justify-center">
        <Image
          src={`/images/rarity/${dragon.rarity}.png`}
          alt={dragon.rarity}
          width={64}
          height={64}
        />
        <div className="flex flex-row gap-1">
          {dragon.elements.map((element, index) => (
            <Image
              key={`${dragon.id}-${element}-${index}`}
              src={`/images/elements/${element}.png`}
              alt={element}
              width={30}
              height={62}
            />
          ))}
        </div>
      </div>
      <figure className="flex justify-center items-center">
        <Image src={dragon.image} alt={dragon.name} width={300} height={300} />
      </figure>
      <div className="flex justify-between items-center">
        Overall Rating:
        <b className="block">{getRatingText(dragon.rating?.overall || 0)}</b>
      </div>
    </div>
  );
};

export default DragonProfile;
