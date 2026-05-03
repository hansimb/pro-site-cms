import type { GlobalConfig } from "payload";
import { HomeBlocks } from "../blocks/home-blocks.ts";

export const HomePage: GlobalConfig = {
  slug: "home-page",
  fields: [
    {
      name: "blocks",
      type: "blocks",
      blocks: HomeBlocks,
    },
  ],
};
