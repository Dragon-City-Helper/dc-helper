import { fetchAllDragonIds } from "@/services/dragons";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.dragoncityhelper.com";

  // Fetch dynamic routes, e.g., dragon IDs
  const dragonIds = await fetchAllDragonIds();

  // Define static routes
  const staticRoutes = [
    "",
    "/tierlist",
    "/terms",
    "/privacy",
    "/alliances",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  // Define dynamic routes
  const dynamicRoutes = dragonIds.map((id) => ({
    url: `${baseUrl}/dragon/${id}`,
    lastModified: new Date().toISOString(),
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
