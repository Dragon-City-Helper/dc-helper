import { Rating } from "@prisma/client";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import RatingDropdown from "./RatingDropdown";
import { dragonsWithRating, putRatings } from "@/services/dragons";

interface IRateDragonsTableProps {
  dragons: dragonsWithRating;
}

const RateDragonsTable: FC<IRateDragonsTableProps> = ({ dragons }) => {
  const keys: Exclude<keyof Rating, "id" | "dragonsId">[] = [
    "cooldown",
    "value",
    "versatility",
    "potency",
    "primary_coverage",
    "crit_coverage",
    "viability",
    "usability",
  ] as const;
  type AllowedKey = (typeof keys)[number];

  const keysText: { [key in AllowedKey]: string } = {
    cooldown: "Cooldown",
    value: "Value",
    versatility: "Versatility",
    potency: "Potency",
    primary_coverage: "Primary Coverage",
    crit_coverage: "Crit Coverage",
    viability: "Viability",
    usability: "Usability",
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
    await putRatings(dragonId, localRatings[dragonId]);
    setDirty({
      ...dirty,
      [dragonId]: false,
    });
    setLoading({
      ...loading,
      [dragonId]: false,
    });
  };
  const onRatingChange = (
    dragonId: string,
    ratingKey: string,
    value: number
  ) => {
    setDirty({
      ...dirty,
      [dragonId]: true,
    });
    setLocalRatings((rating) => {
      return {
        ...rating,
        [dragonId]: {
          ...(rating || {})[dragonId],
          [ratingKey]: value,
        },
      };
    });
  };
  const getScore = (dragonId: string) => {
    const ratings = localRatings[dragonId];
    const {
      cooldown,
      value,
      potency,
      versatility,
      primary_coverage,
      crit_coverage,
    } = ratings || {};
    return (
      (cooldown ?? 0) +
      (value ?? 0) +
      (potency ?? 0) +
      (versatility ?? 0) +
      0.5 * (primary_coverage ?? 0) +
      0.5 * (crit_coverage ?? 0) +
      40
    );
  };
  return (
    <div className="overflow-x-auto">
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
              <tr key={dragon.dragonId} className="hover">
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
                      dragonId={dragon.id}
                      ratingKey={key}
                      value={localRatings?.[dragon.id]?.[key]}
                      onRatingChange={onRatingChange}
                    />
                  </td>
                ))}
                <td>{getScore(dragon.id)}</td>
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
