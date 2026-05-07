import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig, type PayloadEmailAdapter } from "payload";
import sharp from "sharp";
import { getPayloadEnvironment } from "./src/lib/env";
import { Articles } from "./src/payload/collections/articles";
import { CaseStudies } from "./src/payload/collections/case-studies";
import { Media } from "./src/payload/collections/media";
import { Users } from "./src/payload/collections/users";
import { HomePage } from "./src/payload/globals/home-page";
import { SiteSettings } from "./src/payload/globals/site-settings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const payloadEnvironment = getPayloadEnvironment();
const defaultFromAddress = process.env.PAYLOAD_FROM_ADDRESS ?? "no-reply@localhost";
const defaultFromName = process.env.PAYLOAD_FROM_NAME ?? "imberg.dev";

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
    migrationDir: path.resolve(dirname, "src/migrations"),
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
