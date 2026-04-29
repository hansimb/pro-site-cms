import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Articles } from "@/payload/collections/articles";
import { CaseStudies } from "@/payload/collections/case-studies";
import { Media } from "@/payload/collections/media";
import { Users } from "@/payload/collections/users";
import { HomePage } from "@/payload/globals/home-page";
import { SiteSettings } from "@/payload/globals/site-settings";
import { getPayloadEnvironment } from "@/lib/env";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const payloadEnvironment = getPayloadEnvironment();

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    suppressHydrationWarning: true,
    user: Users.slug,
  },
  collections: [Users, Media, Articles, CaseStudies],
  db: postgresAdapter({
    pool: {
      connectionString: payloadEnvironment.databaseUrl,
    },
  }),
  editor: lexicalEditor(),
  globals: [SiteSettings, HomePage],
  secret: payloadEnvironment.payloadSecret,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "src/payload-types.ts"),
  },
});
