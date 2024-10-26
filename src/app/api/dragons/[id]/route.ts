import { NextResponse } from "next/server";
import { updateDragon } from "@/services/dragons";
import { NextRequest } from "next/server";
import { Role } from "@prisma/client";
import { auth } from "@/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = params.id;

  // Authenticate the user
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Authorization: Allow only users with specific roles to update dragons
  if (session.user.role !== Role.ADMIN && session.user.role !== Role.GOD) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();

    // Validate the request body (you may add more validation as needed)
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    // Update the dragon
    const updatedDragon = await updateDragon(id, body);

    return NextResponse.json(updatedDragon);
  } catch (error) {
    console.error("Failed to update dragon:", error);
    return NextResponse.json(
      { error: "Failed to update dragon" },
      { status: 500 },
    );
  }
}
