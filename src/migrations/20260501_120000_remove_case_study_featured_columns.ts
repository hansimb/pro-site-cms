import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from "@payloadcms/db-postgres";

export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  payload.logger.info({
    msg: "Dropping legacy case study featured columns.",
  });

  await db.execute(
    sql`ALTER TABLE ${sql.identifier("case_studies")} DROP COLUMN IF EXISTS "featured"`,
  );

  await db.execute(
    sql`ALTER TABLE ${sql.identifier("_case_studies_v")} DROP COLUMN IF EXISTS "version_featured"`,
  );
}

export async function down({ db, payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info({
    msg: "Restoring legacy case study featured columns.",
  });

  await db.execute(
    sql`ALTER TABLE ${sql.identifier("case_studies")} ADD COLUMN IF NOT EXISTS "featured" BOOLEAN DEFAULT false`,
  );

  await db.execute(
    sql`ALTER TABLE ${sql.identifier("_case_studies_v")} ADD COLUMN IF NOT EXISTS "version_featured" BOOLEAN DEFAULT false`,
  );
}
