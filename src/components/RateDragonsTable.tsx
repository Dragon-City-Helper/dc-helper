import { Rarity, Rating } from "@prisma/client";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import RatingDropdown from "./RatingDropdown";
import { dragonsWithRating, putRatings } from "@/services/dragons";

interface IRateDragonsTableProps {
  dragons: dragonsWithRating;
}

const rarityBasedOffset: { [key in Rarity]: number } = {
  H: 200,
  M: 130,
  L: 100,
  E: 85,
  V: 70,
  R: 60,
  C: 50,
};
const RateDragonsTable: FC<IRateDragonsTableProps> = ({ dragons }) => {
  const keys: Exclude<keyof Rating, "id" | "dragonsId" | "score">[] = [
    "cooldown",
    "value",
    "versatility",
    "potency",
    "primary",
    "coverage",
    "rarity",
    "usability",
    "extra",
  ] as const;
  type AllowedKey = (typeof keys)[number];

  const keysText: { [key in AllowedKey]: string } = {
    cooldown: "Cooldown",
    value: "Value",
    versatility: "Versatility",
    potency: "Potency",
    primary: "Primary",
    coverage: " Coverage",
    rarity: "Stat Boost",
    usability: "Usability",
    extra: "Extra",
  };

  const [localRatings, setLocalRatings] = useState<Record<string, Rating>>({});
  const [dirty, setDirty] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const initState = dragons.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.id]: curr.rating,
      };
    }, {});
    setLocalRatings(initState);
  }, [dragons]);

  const updateDragonRating = async (dragonId: string) => {
    setLoading({
      ...loading,
      [dragonId]: true,
    });
    const { data: newDragonRating } = await putRatings(
      dragonId,
      localRatings[dragonId]
    );
    console.log(newDragonRating);
    setLocalRatings((rating) => {
      return {
        ...rating,
        [dragonId]: newDragonRating,
      };
    });
    setDirty({
      ...dirty,
      [dragonId]: false,
    });
    setLoading({
      ...loading,
      [dragonId]: false,
    });
  };

  // const updateAllDragonRatings = async (dragons: dragonsWithRating) => {
  //   dragons.forEach((dragon) => {
  //     if (dragon.rating) {
  //       updateDragonRating(dragon.id, dragon.rarity);
  //     }
  //   });
  // };
  const onRatingChange = (
    dragon: dragonsWithRating[number],
    ratingKey: string,
    value: number
  ) => {
    setDirty({
      ...dirty,
      [dragon.id]: true,
    });
    setLocalRatings((rating) => {
      const newRating = {
        ...(rating || {})[dragon.id],
        [ratingKey]: value,
      };
      newRating.score = getScore(newRating, dragon.rarity);
      return {
        ...rating,
        [dragon.id]: newRating,
      };
    });
  };
  const getScore = (rating: Rating, dragonRarity: Rarity) => {
    const {
      cooldown,
      value,
      potency,
      versatility,
      primary,
      coverage,
      rarity,
      usability,
      extra,
    } = rating || {};
    return (
      (cooldown ?? 0) +
      (value ?? 0) +
      (potency ?? 0) +
      (versatility ?? 0) +
      (usability ?? 0) +
      0.5 * (primary ?? 0) +
      0.5 * (coverage ?? 0) +
      0.25 * (extra ?? 0) +
      2 * (rarity ?? 0) +
      rarityBasedOffset[dragonRarity]
    );
  };
  return (
    <div className="overflow-x-auto">
      {/* <div className="flex justify-end">
        <button
          className="btn btn-primary"
          onClick={() => updateAllDragonRatings(dragons)}
        >
          recalculate existing ratings
        </button>
      </div> */}
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            {keys.map((key) => (
              <th key={key}>{keysText[key]}</th>
            ))}
            <th>Score</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dragons.map((dragon) => {
            return (
              <tr key={dragon.id} className="hover">
                <td className="w-1/5">
                  <div className="flex flex-row gap-5 items-center">
                    <div className="relative">
                      <div className="p-4">
                        <Image
                          className="rounded-full border-2 border-gray-200"
                          src={dragon.thumbnail}
                          alt={dragon.name}
                          width={100}
                          height={100}
                        />
                      </div>
                      <div className="absolute top-0 right-0">
                        <Image
                          src={`/images/rarity/${dragon.rarity}.png`}
                          alt={dragon.rarity}
                          width={32}
                          height={32}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col justify-between items-start flex-grow">
                      <div className="flex flex-row gap-0 items-start">
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
                      <div className="text-left">{dragon.name}</div>
                    </div>
                  </div>
                </td>

                {keys.map((key) => (
                  <td key={key}>
                    <RatingDropdown
                      dragon={dragon}
                      ratingKey={key}
                      value={localRatings?.[dragon.id]?.[key]}
                      onRatingChange={onRatingChange}
                    />
                  </td>
                ))}
                <td>{localRatings[dragon.id]?.score ?? 0}</td>
                <td>
                  {loading[dragon.id] ? (
                    <span className="loading loading-spinner loading-md"></span>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => updateDragonRating(dragon.id)}
                      disabled={!dirty[dragon.id]}
                    >
                      Save
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RateDragonsTable;
