import { NextResponse, NextRequest } from "next/server";
import { fetchDragon, updateDragon } from "@/services/dragons";
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  console.log(`Fetching dragon with ID: ${id}`); // Log the request for debugging

  try {
    // Attempt to fetch the dragon data
    const dragon = await fetchDragon(id);

    // Check if dragon exists
    if (!dragon) {
      console.warn(`Dragon with ID: ${id} not found.`);
      return NextResponse.json({ error: "Dragon not found" }, { status: 404 });
    }

    console.log(`Dragon with ID: ${id} fetched successfully.`);
    return NextResponse.json(dragon);
  } catch (error) {
    // Log any errors that occur
    console.error(`Error fetching dragon with ID: ${id}`, error);
    return NextResponse.json(
      { error: "Failed to fetch dragon" },
      { status: 500 },
    );
  }
}
