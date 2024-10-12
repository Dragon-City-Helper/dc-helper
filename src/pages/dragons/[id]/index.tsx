import DragonProfile from "@/components/DragonProfile";
import DragonRatings from "@/components/DragonRatings";
import DragonSkills from "@/components/DragonSkills";
import {
  dragonWithSkillsAndRating,
  fetchAllDragonIds,
  fetchDragon,
  fetchSkinsForADragon,
} from "@/services/dragons";
import { GetStaticPropsContext } from "next";

// export async function getStaticPaths() {
//   const dragonIds = await fetchAllDragonIds();
//   const paths = dragonIds.map((id) => ({
//     params: { id },
//   }));
//   return { paths, fallback: false };
// }

export async function getServerSideProps(context: GetStaticPropsContext) {
  const dragonId = context.params?.id as string;
  if (!dragonId) {
    return {
      notFound: true,
    };
  }
  try {
    const dragonData = await fetchDragon(dragonId);
    if (!dragonData) {
      return {
        notFound: true,
      };
    }
    const skinsData = await fetchSkinsForADragon(dragonData.name);
    return {
      props: { dragon: dragonData, skins: skinsData },
      // revalidate: 12 * 60 * 60,
    };
  } catch (err) {
    console.log(err);
  }
}

const Page = ({
  dragon,
  skins,
}: {
  dragon: dragonWithSkillsAndRating;
  skins: dragonWithSkillsAndRating[];
}) => {
  return (
    <div className="flex gap-6 container flex-col">
      <div className="flex justify-between gap-6">
        <div className="w-1/2">
          <DragonProfile dragon={dragon} />
        </div>
        <div className="w-1/2 flex flex-col gap-6">
          <DragonRatings dragon={dragon} />
          <DragonSkills dragon={dragon} />
        </div>
      </div>
      {skins.length > 0 && (
        <div>
          <div className="flex justify-between items-center border border-gray-200 p-2 rounded-box">
            Skins
          </div>
          {skins.map((skin) => (
            <Page key={skin.id} dragon={skin} skins={[]} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
