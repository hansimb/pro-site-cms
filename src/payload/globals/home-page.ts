import type { GlobalConfig } from "payload";
import { HomeBlocks } from "../blocks/home-blocks";
import { revalidatePublicSite } from "../hooks/revalidate-site";

export const HomePage: GlobalConfig = {
  slug: "home-page",
  hooks: {
    afterChange: [async () => revalidatePublicSite()],
  },
  fields: [
    {
      name: "blocks",
      type: "blocks",
      blocks: HomeBlocks,
    },
  ],
};
