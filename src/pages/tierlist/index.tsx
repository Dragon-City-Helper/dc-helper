import {
  dragonsWithRating,
  fetchDragonsWithRatingsNotNull,
} from "@/services/dragons";
import TierListLayout from "@/components/TierListLayout";

export async function getServerSideProps() {
  try {
    const dragons = await fetchDragonsWithRatingsNotNull();
    const sortedDragons = dragons.sort(
      (a, b) => (b.rating?.score || 0) - (a.rating?.score || 0)
    );
    return {
      props: {
        dragons: sortedDragons,
      },
    };
  } catch (error) {
    console.log(error);
  }
}

export default function Page({ dragons }: { dragons: dragonsWithRating }) {
  return <TierListLayout dragons={dragons} />;
}
