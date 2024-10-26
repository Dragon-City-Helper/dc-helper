import { getRatingText, ratingStyles } from "@/constants/Rating";
import { Badge } from "@mantine/core";

export default function RatingBadge({ rating }: { rating?: number }) {
  if (rating) {
    const ratingText = getRatingText(rating);
    const style = ratingStyles[ratingText];
    return (
      <Badge
        style={{
          ...style,
        }}
        w={50}
      >
        {ratingText}
      </Badge>
    );
  }
  return (
    <Badge variant="default" autoContrast>
      Unrated
    </Badge>
  );
}
