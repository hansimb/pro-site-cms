import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig, type PayloadEmailAdapter } from "payload";
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
const defaultFromAddress = process.env.PAYLOAD_FROM_ADDRESS ?? "no-reply@localhost";
const defaultFromName = process.env.PAYLOAD_FROM_NAME ?? "Pro Site CMS";

const consoleEmailAdapter: PayloadEmailAdapter = () => ({
  defaultFromAddress,
  defaultFromName,
  name: "console",
  sendEmail: async (message) => {
    console.log("Payload email:", {
      from: message.from ?? `${defaultFromName} <${defaultFromAddress}>`,
      subject: message.subject ?? "",
      text: message.text ?? "",
      to: message.to ?? "",
    });

    return undefined;
  },
});

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
  email: consoleEmailAdapter,
  editor: lexicalEditor(),
  globals: [SiteSettings, HomePage],
  secret: payloadEnvironment.payloadSecret,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "src/payload-types.ts"),
  },
});
