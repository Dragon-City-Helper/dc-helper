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
  console.log(`Received PUT request for dragon with ID: ${id}`);

  // Authenticate the user
  const session = await auth();

  if (!session || !session.user) {
    console.warn("Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log(`User authenticated. Role: ${session.user.role}`);

  // Authorization: Allow only users with specific roles to update dragons
  if (session.user.role !== Role.ADMIN && session.user.role !== Role.GOD) {
    console.warn(
      `User role '${session.user.role}' is not authorized to update dragons`,
    );
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    console.log("Request body received and parsed");

    // Validate the request body (you may add more validation as needed)
    if (!body || typeof body !== "object") {
      console.warn("Invalid request body received");
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    // Update the dragon
    console.log(`Updating dragon with ID: ${id}`);
    const updatedDragon = await updateDragon(id, body);
    console.log(`Dragon with ID ${id} updated successfully`);

    return NextResponse.json(updatedDragon);
  } catch (error) {
    console.error("Failed to update dragon:", error);
    return NextResponse.json(
      { error: "Failed to update dragon" },
      { status: 500 },
    );
  }
}
