import DragonDetails from "@/components/DragonDetails";
import { dragonWithSkillsAndRating, getDragonById } from "@/services/dragons";
import { Center, Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import DragonDetailsSkeleton from "./DragonDetailsSkeleton";

export default function DragonPanelContent({ id }: { id: string }) {
  const [dragon, setDragon] = useState<dragonWithSkillsAndRating | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getDragonById(id)
      .then((data) => {
        setDragon(data);
      })
      .catch((err) => {
        setDragon(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Center>
        <DragonDetailsSkeleton />
      </Center>
    );
  }

  return (
    <>
      {dragon ? (
        <DragonDetails dragon={dragon} hideTitle={true} />
      ) : (
        <Center>Dragon Details not found</Center>
      )}
    </>
  );
}
