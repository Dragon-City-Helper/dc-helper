import DragonDetails from "@/components/DragonDetails";
import { fullDragon, getDragonById } from "@/services/dragons";
import { Center, Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import DragonDetailsSkeleton from "./DragonDetailsSkeleton";

export default function DragonPanelContent({ id }: { id: string }) {
  const [dragon, setDragon] = useState<fullDragon | null>(null);
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
    return <DragonDetailsSkeleton />;
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
