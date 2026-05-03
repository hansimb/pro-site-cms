import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from "@payloadcms/db-postgres";

export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  payload.logger.info({
    msg: "Adding contact settings fields and GitHub homepage block table.",
  });

  await db.execute(
    sql`
      ALTER TABLE ${sql.identifier("site_settings")}
      ADD COLUMN IF NOT EXISTS "contact_email" varchar,
      ADD COLUMN IF NOT EXISTS "contact_linkedin_url" varchar,
      ADD COLUMN IF NOT EXISTS "contact_github_url" varchar
    `,
  );

  await db.execute(
    sql`
      CREATE TABLE IF NOT EXISTS ${sql.identifier("home_page_blocks_github_profile")} (
        "_order" integer,
        "_parent_id" integer,
        "_path" text,
        "id" varchar PRIMARY KEY,
        "heading" varchar,
        "intro" varchar,
        "cta_label" varchar,
        "cta_url" varchar,
        "block_name" varchar
      )
    `,
  );

  await db.execute(
    sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'home_page_blocks_github_profile_parent_id_fk'
        ) THEN
          ALTER TABLE ${sql.identifier("home_page_blocks_github_profile")}
          ADD CONSTRAINT "home_page_blocks_github_profile_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES ${sql.identifier("home_page")}("id")
          ON DELETE CASCADE;
        END IF;
      END $$;
    `,
  );
}

export async function down({ db, payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info({
    msg: "Removing contact settings fields and GitHub homepage block table.",
  });

  await db.execute(
    sql`
      DROP TABLE IF EXISTS ${sql.identifier("home_page_blocks_github_profile")}
    `,
  );

  await db.execute(
    sql`
      ALTER TABLE ${sql.identifier("site_settings")}
      DROP COLUMN IF EXISTS "contact_email",
      DROP COLUMN IF EXISTS "contact_linkedin_url",
      DROP COLUMN IF EXISTS "contact_github_url"
    `,
  );
}
