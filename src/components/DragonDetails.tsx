import { dragonWithSkillsAndRating } from "@/services/dragons";
import { FC } from "react";
import DragonProfile from "./DragonProfile";
import DragonRatings from "./DragonRatings";
import DragonSkills from "./DragonSkills";

interface IDragonDetailsProps {
  dragon: dragonWithSkillsAndRating;
}
const DragonDetails: FC<IDragonDetailsProps> = ({ dragon }) => {
  return (
    <div className="flex justify-between gap-6">
      <div className="w-1/2">
        <DragonProfile dragon={dragon} />
      </div>
      <div className="w-1/2 flex flex-col gap-6">
        <DragonRatings dragon={dragon} />
        <DragonSkills dragon={dragon} />
      </div>
    </div>
  );
};

export default DragonDetails;
