import { dragonWithSkillsAndRating } from "@/services/dragons";
import Image from "next/image";
import { FC } from "react";

interface IDragonSkillsProps {
  dragon: dragonWithSkillsAndRating;
}

const DragonSkills: FC<IDragonSkillsProps> = ({ dragon }) => {
  return (
    <div className="flex gap-6 w-full flex-col">
      <div className="flex justify-between items-center border border-gray-200 p-2 rounded-box">
        Skills
      </div>
      {dragon.skills?.length > 0 ? (
        dragon.skills.map((skill) => (
          <div key={skill.id} className="flex w-full border items-center">
            <div className="w-1/5">
              <Image
                src={`/images/skilltype/${skill.skillType}.png`}
                alt={skill.name}
                width={32}
                height={32}
              />
            </div>
            <div className="flex flex-col">
              <div> {skill.name}</div>
              <div> {skill.description}</div>
            </div>
          </div>
        ))
      ) : (
        <div> No Skills</div>
      )}
    </div>
  );
};

export default DragonSkills;
