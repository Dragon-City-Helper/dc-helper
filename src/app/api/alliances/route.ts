import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createAlliance, fetchAlliances } from "@/services/alliances";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    console.error("Unauthorized access attempt to POST /api/alliances");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    console.log(
      `Received POST /api/alliances from user ${session.user.id}`,
      data
    );

    const alliance = await createAlliance(data, session.user.id);

    console.log(
      `${alliance.name} Alliance created with ID ${alliance.id} by user ${session.user.id}`
    );
    return NextResponse.json(alliance, { status: 201 });
  } catch (error) {
    console.error("Error creating alliance:", error);
    return NextResponse.json(
      { error: "Failed to create alliance" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    console.log("Received GET /api/alliances");

    // Extract query parameters
    const { searchParams } = new URL(req.url);

    const pageParam = searchParams.get("page");
    const page = pageParam ? parseInt(pageParam, 10) : 1;

    // Maximum 20 items per page
    const perPage = 20;

    // Limit for sponsored results on top
    const sponsoredLimit = 5;

    // Filters
    const isRecruiting = searchParams.get("isRecruiting");
    const minMasterPoints = searchParams.get("minMasterPoints"); // Simplified
    const discord = searchParams.get("discord"); // Simplified
    const contribution = searchParams.get("contribution"); // Simplified
    const tags = searchParams.getAll("tags");

    // Build where clause for Prisma query
    const { alliances, totalItems, totalPages } = await fetchAlliances({
      isRecruiting: isRecruiting ? isRecruiting === "true" : true,
      tags,
      minMasterPoints: minMasterPoints ? parseInt(minMasterPoints, 10) : 0,
      discord: discord ? discord === "true" : true,
      contribution: contribution ? contribution === "true" : true,
      sponsoredLimit,
      page,
      perPage,
    });

    // Return alliances along with pagination info
    return NextResponse.json(
      {
        data: alliances,
        pagination: {
          totalItems,
          currentPage: page,
          totalPages,
          perPage,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching alliances:", error);
    return NextResponse.json(
      { error: "Failed to fetch alliances" },
      { status: 500 }
    );
  }
}
