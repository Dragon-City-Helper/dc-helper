function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function addDiscordRoleToUser(
  userId: string,
): Promise<{ userId: string; success: boolean; message: string }> {
  const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!;
  const GUILD_ID = process.env.DISCORD_GUILD_ID!;
  const ROLE_ID = process.env.DISCORD_ROLE_ID!;

  const url = `https://discord.com/api/v10/guilds/${GUILD_ID}/members/${userId}/roles/${ROLE_ID}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    await delay(500); // 500ms delay between requests
    if (response.ok) {
      console.log(`Role ${ROLE_ID} added to user ${userId}`);
      return {
        userId,
        success: true,
        message: `Role ${ROLE_ID} added successfully.`,
      };
    } else {
      const errorText = await response.text();
      console.error(`Failed to add role for user ${userId}: ${errorText}`);
      return {
        userId,
        success: false,
        message: `Failed to add role: ${errorText}`,
      };
    }
  } catch (error) {
    console.error(`Error adding role for user ${userId}:`, error);
    return {
      userId,
      success: false,
      message: `Error: ${(error as Error).message}`,
    };
  }
}
