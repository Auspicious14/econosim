import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://econosim.app",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    // In a real app, we would potentially generate URLs for each scenario if they had individual permalinks
    // {
    //   url: 'https://econosim.app/scenarios/phone-purchase',
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.8,
    // },
  ];
}
