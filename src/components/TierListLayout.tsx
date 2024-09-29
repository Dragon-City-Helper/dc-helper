import { dragonsWithRating } from "@/services/dragons";
import { FC } from "react";
import DragonFaceCard from "./DragonFaceCard";

interface ITierListLayoutProps {
  dragons: dragonsWithRating;
}
const TierListLayout: FC<ITierListLayoutProps> = ({ dragons }) => {
  return (
    <div className="flex flex-wrap gap-8">
      {dragons.map((dragon) => (
        <DragonFaceCard dragon={dragon} key={dragon.id} />
      ))}
    </div>
  );
};

export default TierListLayout;
