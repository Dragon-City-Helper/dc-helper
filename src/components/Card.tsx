import { FC, ReactNode } from "react";

interface ICardProps {
  title: string;
  children: ReactNode;
}
const Card: FC<ICardProps> = ({ title, children }) => {
  return (
    <div className="card bg-base-100 w-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default Card;
