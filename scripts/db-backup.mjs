import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

export function parseDotEnv(content) {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
    .reduce((env, line) => {
      const separatorIndex = line.indexOf("=");

      if (separatorIndex < 0) {
        return env;
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();

      if (!key) {
        return env;
      }

      env[key] = value;
      return env;
    }, {});
}

export function resolveConnectionString(env) {
  return env.DATABASE_URL || env.NEON_CONNECTION_STRING || "";
}

export function buildBackupFilePath(projectRoot, now = new Date()) {
  const timestamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-") +
    "_" +
    [
      String(now.getHours()).padStart(2, "0"),
      String(now.getMinutes()).padStart(2, "0"),
      String(now.getSeconds()).padStart(2, "0"),
    ].join("-");

  return path.join(projectRoot, "db_backups", `prod-${timestamp}.dump`);
}

function loadProjectEnv(projectRoot) {
  const envPath = path.join(projectRoot, ".env");

  try {
    return parseDotEnv(readFileSync(envPath, "utf8"));
  } catch {
    return {};
  }
}

export async function runBackup({
  now = new Date(),
  projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
} = {}) {
  const envFromFile = loadProjectEnv(projectRoot);
  const mergedEnv = { ...envFromFile, ...process.env };
  const connectionString = resolveConnectionString(mergedEnv);

  if (!connectionString) {
    throw new Error(
      "Missing DATABASE_URL or NEON_CONNECTION_STRING. Cannot create database backup.",
    );
  }

  const backupDirectory = path.join(projectRoot, "db_backups");
  const backupFilePath = buildBackupFilePath(projectRoot, now);

  mkdirSync(backupDirectory, { recursive: true });

  await new Promise((resolve, reject) => {
    const child = spawn(
      "pg_dump",
      [
        `--dbname=${connectionString}`,
        "--format=custom",
        "--no-owner",
        "--no-privileges",
        `--file=${backupFilePath}`,
      ],
      {
        cwd: projectRoot,
        env: process.env,
        stdio: "inherit",
      },
    );

    child.on("error", (error) => {
      reject(
        new Error(
          `Failed to start pg_dump. Make sure PostgreSQL tools are installed and pg_dump is on PATH. ${error.message}`,
        ),
      );
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve(undefined);
        return;
      }

      reject(new Error(`pg_dump exited with code ${String(code)}.`));
    });
  });

  return backupFilePath;
}

const isDirectExecution =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectExecution) {
  runBackup()
    .then((backupFilePath) => {
      console.log(`Database backup created: ${backupFilePath}`);
    })
    .catch((error) => {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    });
}
