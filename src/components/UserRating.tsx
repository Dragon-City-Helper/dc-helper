import { Group, Rating, Text } from "@mantine/core";
import { FC } from "react";

interface IUserRatingProps {
  value: number;
  onRatingChange: (value: number) => void;
}

const UserRating: FC<IUserRatingProps> = ({ value, onRatingChange }) => {
  return (
    <Group justify="space-between">
      <Text> Your Rating </Text>
      <Rating value={value} onChange={onRatingChange} fractions={4} />
    </Group>
  );
};

export default UserRating;
