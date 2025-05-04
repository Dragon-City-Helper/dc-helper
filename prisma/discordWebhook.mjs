export async function addDiscordDragonUpdatesWebhook(message, dragons) {
  const webhookUrl = ` https://discord.com/api/webhooks/1367893702751813743/2-2vGSKmFJkd3--GydAwPs-Z3LH75_PQprq7ZJ7Wd_vZU9htWFwPojUJXIAj437SxDBl`;
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: `<@&1306491492512038952> ${message}`,
      embeds: dragons.map((dragon) => ({
        title: dragon.name,
        url: `https://www.dragoncityhelper.com/dragon/${dragon.id}`,
        image: {
          url: dragon.image,
        },
      })),
    }),
  });
  return response;
}
