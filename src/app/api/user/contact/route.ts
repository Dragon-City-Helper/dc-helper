import { NextResponse } from "next/server";
import { updateUserContact, getUserContact } from "@/services/userService";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await getUserContact(session.user.id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error("Error fetching user contact:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact information" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { discord, facebook, twitter, instagram, reddit } = body;

    // Basic validation
    if (!discord && !facebook && !twitter && !instagram && !reddit) {
      return NextResponse.json(
        { error: "At least one contact field is required" },
        { status: 400 }
      );
    }

    const result = await updateUserContact(session.user.id, {
      discord: discord || null,
      facebook: facebook || null,
      twitter: twitter || null,
      instagram: instagram || null,
      reddit: reddit || null,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error("Error updating user contact:", error);
    return NextResponse.json(
      { error: "Failed to update contact information" },
      { status: 500 }
    );
  }
}
