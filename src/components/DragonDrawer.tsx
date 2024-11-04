import DragonDetails from "@/components/DragonDetails";
import { dragonWithSkillsAndRating, getDragonById } from "@/services/dragons";
import { Center, Loader } from "@mantine/core";
import { useEffect, useState } from "react";

export default function DragonDrawer({ id }: { id: string }) {
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
        <Loader />
      </Center>
    );
  }

  return (
    <>
      {dragon ? (
        <DragonDetails dragon={dragon} />
      ) : (
        <Center>Dragon Details not found</Center>
      )}
    </>
  );
}
