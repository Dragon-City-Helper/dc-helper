import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/rate/", "/api/", "/dashboard"],
      },
    ],
    sitemap: "https://www.dragoncityhelper.com/sitemap.xml",
  };
}
