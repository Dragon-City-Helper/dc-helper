import prisma from "@/lib/prisma";
import { addDiscordRoleToUser } from "@/utils/discord";
import { headers } from "next/headers";

export async function GET(): Promise<Response> {
  const results: Array<{ userId: string; success: boolean; message: string }> =
    [];

  try {
    const headersList = headers();
    const authHeader = headersList.get("Authorization");
    // Authorization check
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response("Unauthorized", { status: 401 });
    }
    // Fetch accounts where the role hasn't been assigned
    const accounts = await prisma.account.findMany({
      where: {
        provider: "discord",
        roleAssigned: false,
      },
    });

    console.log(`Found ${accounts.length} accounts without roles`);

    for (const account of accounts) {
      const result = await addDiscordRoleToUser(account.providerAccountId);

      if (result.success) {
        // Update the database to mark the role as assigned
        await prisma.account.update({
          where: { id: account.id },
          data: { roleAssigned: true },
        });
      }

      // Collect the result for summary
      results.push(result);
    }

    // Log summary results
    console.log("Cron Job Summary:", results);

    return new Response(
      JSON.stringify({
        message: "Cron job executed",
        processedAccounts: accounts.length,
        results,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error executing cron job:", error);

    return new Response(
      JSON.stringify({
        message: "Internal server error",
        error: (error as Error).message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  } finally {
    await prisma.$disconnect();
  }
}
