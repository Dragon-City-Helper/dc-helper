import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAuthorized } from "@/utils/auth";
import {
  deleteAlliance,
  getAllianceById,
  updateAlliance,
} from "@/services/alliances";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const allianceId = params.id;

  if (!session?.user) {
    console.error(
      `Unauthorized access attempt to PUT /api/alliances/${allianceId}`
    );
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log(
      `User ${session.user.id} attempting to update alliance ${allianceId}`
    );

    const alliance = await getAllianceById(allianceId);

    if (!alliance || alliance.isDeleted) {
      console.warn(`Alliance ${allianceId} not found or is deleted`);
      return NextResponse.json(
        { error: "Alliance not found" },
        { status: 404 }
      );
    }

    if (!isAuthorized(session.user, alliance.createdBy)) {
      console.warn(
        `User ${session.user.id} is not authorized to update alliance ${allianceId}`
      );
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();
    console.log(`Updating alliance ${allianceId} with data`, data);

    const updatedAlliance = await updateAlliance(allianceId, data);

    console.log(
      `Alliance ${allianceId} updated successfully by user ${session.user.id}`
    );
    return NextResponse.json(updatedAlliance, { status: 200 });
  } catch (error) {
    console.error(`Error updating alliance ${allianceId}:`, error);
    return NextResponse.json(
      { error: "Failed to update alliance" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const allianceId = params.id;

  if (!session?.user) {
    console.error(
      `Unauthorized access attempt to DELETE /api/alliances/${allianceId}`
    );
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log(
      `User ${session.user.id} attempting to delete alliance ${allianceId}`
    );

    const alliance = await getAllianceById(allianceId);

    if (!alliance || alliance.isDeleted) {
      console.warn(`Alliance ${allianceId} not found or is already deleted`);
      return NextResponse.json(
        { error: "Alliance not found" },
        { status: 404 }
      );
    }

    if (!isAuthorized(session.user, alliance.createdBy)) {
      console.warn(
        `User ${session.user.id} is not authorized to delete alliance ${allianceId}`
      );
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await deleteAlliance(allianceId);

    console.log(
      `Alliance ${allianceId} soft-deleted by user ${session.user.id}`
    );
    return NextResponse.json(
      { message: "Alliance deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting alliance ${allianceId}:`, error);
    return NextResponse.json(
      { error: "Failed to delete alliance" },
      { status: 500 }
    );
  }
}
