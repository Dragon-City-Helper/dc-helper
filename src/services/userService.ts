"use server";

import prisma from "@/lib/prisma";

export interface UpdateContactData {
  discord?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  reddit?: string | null;
}

export const updateUserContact = async (
  userId: string,
  contactData: UpdateContactData
) => {
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { Contacts: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Update or create contact information
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        Contacts: user.Contacts
          ? {
              update: {
                discord: contactData.discord,
                facebook: contactData.facebook,
                twitter: contactData.twitter,
                instagram: contactData.instagram,
                reddit: contactData.reddit,
              },
            }
          : {
              create: {
                discord: contactData.discord,
                facebook: contactData.facebook,
                twitter: contactData.twitter,
                instagram: contactData.instagram,
                reddit: contactData.reddit,
              },
            },
      },
      include: {
        Contacts: true,
      },
    });

    return {
      success: true,
      data: updatedUser.Contacts,
    };
  } catch (error) {
    console.error("Error updating user contact:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update contact information",
    };
  }
};

export const getUserContact = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { Contacts: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      success: true,
      data: user.Contacts || null,
    };
  } catch (error) {
    console.error("Error fetching user contact:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch contact information",
    };
  }
};
