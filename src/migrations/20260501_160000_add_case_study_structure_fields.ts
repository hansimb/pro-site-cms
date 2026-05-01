import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from "@payloadcms/db-postgres";

export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  payload.logger.info({
    msg: "Adding standardized case study structure fields.",
  });

  await db.execute(
    sql`
      ALTER TABLE ${sql.identifier("case_studies")}
      ADD COLUMN IF NOT EXISTS "background" varchar,
      ADD COLUMN IF NOT EXISTS "problem" varchar,
      ADD COLUMN IF NOT EXISTS "solution" varchar,
      ADD COLUMN IF NOT EXISTS "process" varchar,
      ADD COLUMN IF NOT EXISTS "results" varchar,
      ADD COLUMN IF NOT EXISTS "what_i_learned" varchar
    `,
  );

  await db.execute(
    sql`
      ALTER TABLE ${sql.identifier("_case_studies_v")}
      ADD COLUMN IF NOT EXISTS "version_background" varchar,
      ADD COLUMN IF NOT EXISTS "version_problem" varchar,
      ADD COLUMN IF NOT EXISTS "version_solution" varchar,
      ADD COLUMN IF NOT EXISTS "version_process" varchar,
      ADD COLUMN IF NOT EXISTS "version_results" varchar,
      ADD COLUMN IF NOT EXISTS "version_what_i_learned" varchar
    `,
  );
}

export async function down({ db, payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info({
    msg: "Removing standardized case study structure fields.",
  });

  await db.execute(
    sql`
      ALTER TABLE ${sql.identifier("_case_studies_v")}
      DROP COLUMN IF EXISTS "version_background",
      DROP COLUMN IF EXISTS "version_problem",
      DROP COLUMN IF EXISTS "version_solution",
      DROP COLUMN IF EXISTS "version_process",
      DROP COLUMN IF EXISTS "version_results",
      DROP COLUMN IF EXISTS "version_what_i_learned"
    `,
  );

  await db.execute(
    sql`
      ALTER TABLE ${sql.identifier("case_studies")}
      DROP COLUMN IF EXISTS "background",
      DROP COLUMN IF EXISTS "problem",
      DROP COLUMN IF EXISTS "solution",
      DROP COLUMN IF EXISTS "process",
      DROP COLUMN IF EXISTS "results",
      DROP COLUMN IF EXISTS "what_i_learned"
    `,
  );
}
