import { NextResponse } from "next/server";
import {
  createUserRating,
  updateRating,
  deleteRating,
  getUserRatingForADragon,
} from "@/services/userRatings";
import { auth } from "@/auth";

export async function POST(request: Request) {
  console.log("POST request received at /api/user-ratings");

  try {
    const session = await auth();

    if (!session || !session.user) {
      console.warn(
        "Unauthorized access attempt detected. Redirecting to signin."
      );
      return NextResponse.redirect("/api/auth/signin");
    }

    const { id: userId } = session.user;
    const {
      dragonId,
      rating,
    }: { dragonId: string; rating: { arena?: number; design?: number } } =
      await request.json();
    const createdRating = await createUserRating(userId, dragonId, rating);
    console.log(`Created rating: ${JSON.stringify(createdRating)}`);

    return NextResponse.json(createdRating);
  } catch (error) {
    console.error("Error creating rating:", error);
    return NextResponse.json(
      { error: "Failed to create rating" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  console.log("PUT request received at /api/user-ratings");

  try {
    const session = await auth();

    if (!session || !session.user) {
      console.warn(
        "Unauthorized access attempt detected. Redirecting to signin."
      );
      return NextResponse.redirect("/api/auth/signin");
    }

    const { id: userId } = session.user;
    const {
      dragonId,
      rating,
    }: { dragonId: string; rating: { arena?: number; design?: number } } =
      await request.json();
    const updatedRating = await updateRating(userId, dragonId, rating);
    console.log(`Updated rating: ${JSON.stringify(updatedRating)}`);

    return NextResponse.json(updatedRating);
  } catch (error) {
    console.error("Error updating rating:", error);
    return NextResponse.json(
      { error: "Failed to update rating" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  console.log("DELETE request received at /api/user-ratings");

  try {
    const session = await auth();

    if (!session || !session.user) {
      console.warn(
        "Unauthorized access attempt detected. Redirecting to signin."
      );
      return NextResponse.redirect("/api/auth/signin");
    }

    const { id: userId } = session.user;
    const { dragonId } = await request.json();
    const deletedRating = await deleteRating(userId, dragonId);
    console.log(`Deleted rating: ${JSON.stringify(deletedRating)}`);

    return NextResponse.json(deletedRating);
  } catch (error) {
    console.error("Error deleting rating:", error);
    return NextResponse.json(
      { error: "Failed to delete rating" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      console.warn("user not authorized to view this rating.");
      return NextResponse.json(
        { error: "User not authorized" },
        { status: 401 }
      );
    }
    const { id: userId } = session.user;
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const dragonId = searchParams.get("dragonId");
    if (!dragonId) {
      return NextResponse.json(
        { error: "Dragon ID is required" },
        { status: 400 }
      );
    }
    const rating = await getUserRatingForADragon(userId, dragonId);
    if (!rating) {
      return NextResponse.json({ error: "Rating not found" }, { status: 404 });
    }
    return NextResponse.json(rating);
  } catch (error) {
    console.error("Error fetching rating:", error);
    return NextResponse.json(
      { error: "Failed to fetch rating" },
      { status: 500 }
    );
  }
}
