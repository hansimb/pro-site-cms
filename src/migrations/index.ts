import * as migration_20260501_120000_remove_case_study_featured_columns from "./20260501_120000_remove_case_study_featured_columns";
import * as migration_20260501_160000_add_case_study_structure_fields from "./20260501_160000_add_case_study_structure_fields";
import * as migration_20260503_190000_add_site_settings_seo_fields from "./20260503_190000_add_site_settings_seo_fields";

export const migrations = [
  {
    up: migration_20260501_120000_remove_case_study_featured_columns.up,
    down: migration_20260501_120000_remove_case_study_featured_columns.down,
    name: "20260501_120000_remove_case_study_featured_columns",
  },
  {
    up: migration_20260501_160000_add_case_study_structure_fields.up,
    down: migration_20260501_160000_add_case_study_structure_fields.down,
    name: "20260501_160000_add_case_study_structure_fields",
  },
  {
    up: migration_20260503_190000_add_site_settings_seo_fields.up,
    down: migration_20260503_190000_add_site_settings_seo_fields.down,
    name: "20260503_190000_add_site_settings_seo_fields",
  },
];
