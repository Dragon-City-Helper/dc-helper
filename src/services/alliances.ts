import prisma from "@/lib/prisma";
import { cache } from "react";

export const createAlliance = async (data: any, userId: string) => {
  return await prisma.alliance.create({
    data: {
      name: data.name,
      description: data.description,
      tags: data.tags,
      isSponsored: data.isSponsored,
      isRecruiting: data.isRecruiting,
      openSpots: data.openSpots,
      contact: data.contact,
      createdBy: userId,
      requirements: {
        create: data.requirements,
      },
    },
  });
};

export const getAllianceById = async (allianceId: string) => {
  return await prisma.alliance.findUnique({
    where: { id: allianceId },
  });
};

export const deleteAlliance = async (allianceId: string) => {
  return await prisma.alliance.update({
    where: { id: allianceId },
    data: { isDeleted: true },
  });
};

export const updateAlliance = async (allianceId: string, data: any) => {
  return await prisma.alliance.update({
    where: { id: allianceId },
    data: {
      name: data.name,
      description: data.description,
      tags: data.tags,
      isSponsored: data.isSponsored,
      isRecruiting: data.isRecruiting,
      openSpots: data.openSpots,
      contact: data.contact,
      updatedAt: new Date(),
      requirements: {
        update: data.requirements,
      },
    },
  });
};

export const getAllianceTags = async () => {
  const alliances = await prisma.alliance.findMany({
    where: {
      isDeleted: false,
    },
    select: {
      tags: true,
    },
  });

  // Collect all tags into a set to ensure uniqueness
  const tagSet = new Set<string>();

  alliances.forEach((alliance) => {
    alliance.tags.forEach((tag) => tagSet.add(tag));
  });

  const uniqueTags = Array.from(tagSet).sort(); // Optionally sort the tags
  return uniqueTags;
};

// Helper function to construct the base where clause
const constructBaseWhereClause = ({
  isRecruiting,
  tags,
}: {
  isRecruiting?: boolean;
  tags: string[];
}) => {
  const baseWhereClause: any = {
    isDeleted: false,
    isRecruiting:
      isRecruiting !== null || isRecruiting !== undefined ? isRecruiting : true, // Default isRecruiting: true
  };

  if (tags?.length > 0) {
    baseWhereClause.tags = { hasSome: tags };
  }

  return baseWhereClause;
};

// Helper function to construct the requirements filter
const constructRequirementsFilter = (
  minMasterPoints?: number,
  discord?: boolean,
  contribution?: boolean
) => {
  const requirementsFilter: any = {};

  if (minMasterPoints) {
    requirementsFilter.minMasterPoints = { gte: minMasterPoints };
  }
  if (discord !== null) {
    requirementsFilter.discord = discord;
  }
  if (contribution !== null) {
    requirementsFilter.contribution = contribution;
  }

  return requirementsFilter;
};

// Helper function to fetch alliances
const fetchAlliancesByCriteria = async (
  whereClause: any,
  skip: number,
  take: number
) => {
  return await prisma.alliance.findMany({
    where: {
      ...whereClause,
    },
    include: { requirements: true },
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });
};

// Helper function to fetch total count
const fetchTotalCount = async (whereClause: any, sponsoredIds: string[]) => {
  return await prisma.alliance.count({
    where: {
      ...whereClause,
      isSponsored: false,
      id: { notIn: sponsoredIds },
    },
  });
};

export const fetchUserOwnedAlliances = cache(async (userId: string) => {
  return fetchAlliancesByCriteria(
    {
      createdBy: userId,
    },
    0,
    100
  );
});

// Main function
export const fetchAlliances = async ({
  isRecruiting = true,
  tags = [],
  minMasterPoints,
  discord,
  contribution,
  sponsoredLimit = 3,
  page = 1,
  perPage = 20,
}: {
  isRecruiting?: boolean;
  tags?: string[];
  minMasterPoints?: number;
  discord?: boolean;
  contribution?: boolean;
  sponsoredLimit?: number;
  page?: number;
  perPage?: number;
}) => {
  // Step 1: Build base where clause and requirements filter
  const baseWhereClause = constructBaseWhereClause({ isRecruiting, tags });
  const requirementsFilter = constructRequirementsFilter(
    minMasterPoints,
    discord,
    contribution
  );

  // Add requirements filter to base clause if any conditions are specified
  if (Object.keys(requirementsFilter).length > 0) {
    baseWhereClause.requirements = requirementsFilter;
  }
  const sponseredBaseWhereClause = {
    ...baseWhereClause,
    isSponsored: true,
  };
  console.log("Filters applied:", baseWhereClause);

  // Step 2: Fetch sponsored alliances
  const sponsoredAlliances = await fetchAlliancesByCriteria(
    sponseredBaseWhereClause,
    0,
    sponsoredLimit
  );

  const sponsoredIds = sponsoredAlliances.map((alliance) => alliance.id);

  // Step 3: Fetch non-sponsored alliances
  const nonSponsoredSkip = (page - 1) * perPage;
  const nonSponsoredTake = perPage - sponsoredAlliances.length;

  const nonSponserdBaseWhereClause = {
    ...baseWhereClause,
    isSponsored: false,
    id: { notIn: sponsoredIds },
  };

  const nonSponsoredAlliances = await fetchAlliancesByCriteria(
    nonSponserdBaseWhereClause,
    nonSponsoredSkip,
    nonSponsoredTake
  );

  // Step 4: Combine results
  const alliances = [...sponsoredAlliances, ...nonSponsoredAlliances];

  // Step 5: Fetch total count for pagination
  const totalNonSponsoredCount = await fetchTotalCount(
    baseWhereClause,
    sponsoredIds
  );

  const totalItems = sponsoredAlliances.length + totalNonSponsoredCount;
  const totalPages = Math.ceil(totalItems / perPage);

  console.log(`Fetched ${alliances.length} alliances on page ${page}`);
  console.log(`Total alliances: ${totalItems}, Total pages: ${totalPages}`);

  return { alliances, totalItems, totalPages };
};

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
export type Alliances = ThenArg<ReturnType<typeof fetchAlliancesByCriteria>>;
export type AllianceWithRequirements = Alliances[number];
