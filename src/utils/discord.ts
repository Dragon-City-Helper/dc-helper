export async function addDiscordRoleToUser(userId: string): Promise<void> {
  const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
  const GUILD_ID = process.env.DISCORD_GUILD_ID;
  const ROLE_ID = process.env.DISCORD_ROLE_ID;

  const url = `https://discord.com/api/v10/guilds/${GUILD_ID}/members/${userId}/roles/${ROLE_ID}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bot ${BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    console.log(`Role ${ROLE_ID} added to user ${userId}`);
  } else {
    const errorText = await response.text();
    console.error(`Failed to add role: ${errorText}`);
  }
}
