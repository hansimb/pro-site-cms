import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from "@payloadcms/db-postgres";

export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  payload.logger.info({
    msg: "Adding SEO fields to site settings.",
  });

  await db.execute(
    sql`
      ALTER TABLE ${sql.identifier("site_settings")}
      ADD COLUMN IF NOT EXISTS "seo_site_url" varchar,
      ADD COLUMN IF NOT EXISTS "seo_meta_title" varchar,
      ADD COLUMN IF NOT EXISTS "seo_meta_description" varchar,
      ADD COLUMN IF NOT EXISTS "seo_open_graph_title" varchar,
      ADD COLUMN IF NOT EXISTS "seo_open_graph_description" varchar,
      ADD COLUMN IF NOT EXISTS "seo_twitter_title" varchar,
      ADD COLUMN IF NOT EXISTS "seo_twitter_description" varchar,
      ADD COLUMN IF NOT EXISTS "seo_no_index" boolean
    `,
  );
}

export async function down({ db, payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info({
    msg: "Removing SEO fields from site settings.",
  });

  await db.execute(
    sql`
      ALTER TABLE ${sql.identifier("site_settings")}
      DROP COLUMN IF EXISTS "seo_site_url",
      DROP COLUMN IF EXISTS "seo_meta_title",
      DROP COLUMN IF EXISTS "seo_meta_description",
      DROP COLUMN IF EXISTS "seo_open_graph_title",
      DROP COLUMN IF EXISTS "seo_open_graph_description",
      DROP COLUMN IF EXISTS "seo_twitter_title",
      DROP COLUMN IF EXISTS "seo_twitter_description",
      DROP COLUMN IF EXISTS "seo_no_index"
    `,
  );
}
