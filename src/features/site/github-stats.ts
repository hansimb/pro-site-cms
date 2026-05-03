export type GithubStatCard = {
  key:
    | "publicRepos"
    | "contributionsYear"
    | "contributionsAllTime"
    | "codingTime"
    | "productionDeployments";
  label: string;
  value?: string;
};

type GithubUserResponse = {
  public_repos?: unknown;
};

type GithubContributionsResponse = {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions?: unknown;
        };
      };
    };
  };
};

type WakatimeResponse = {
  data?: {
    text?: unknown;
    total_seconds?: unknown;
  };
};

function parseGithubRepository(repoUrl?: string):
  | { owner: string; repo: string }
  | undefined {
  if (!repoUrl) {
    return undefined;
  }

  try {
    const url = new URL(repoUrl);
    const [owner, repo] = url.pathname.split("/").filter(Boolean);

    if (!owner || !repo) {
      return undefined;
    }

    return {
      owner,
      repo: repo.replace(/\.git$/i, ""),
    };
  } catch {
    return undefined;
  }
}

function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function parseGithubUsername(githubUrl?: string): string | undefined {
  if (!githubUrl) {
    return undefined;
  }

  try {
    const url = new URL(githubUrl);
    const [username] = url.pathname.split("/").filter(Boolean);
    return username?.trim() ? username.trim() : undefined;
  } catch {
    return undefined;
  }
}

async function safeJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T | undefined> {
  try {
    const response = await fetch(input, {
      ...init,
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return undefined;
    }

    return (await response.json()) as T;
  } catch {
    return undefined;
  }
}

async function getPublicRepositoryCount(
  username: string,
): Promise<string | undefined> {
  const data = await safeJson<GithubUserResponse>(
    `https://api.github.com/users/${encodeURIComponent(username)}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "imberg-dev-site",
      },
    },
  );

  return isPositiveNumber(data?.public_repos)
    ? formatCount(data.public_repos)
    : undefined;
}

async function getContributionCount(
  username: string,
  window: "allTime" | "year",
): Promise<string | undefined> {
  const token =
    process.env.GITHUB_TOKEN?.trim() || process.env.GITHUB_API?.trim();

  if (!token) {
    return undefined;
  }

  const now = new Date();
  const start = new Date(now);

  if (window === "allTime") {
    start.setUTCFullYear(2008, 0, 1);
    start.setUTCHours(0, 0, 0, 0);
  } else {
    start.setUTCFullYear(start.getUTCFullYear() - 1);
  }

  const end = now.toISOString();

  const data = await safeJson<GithubContributionsResponse>(
    "https://api.github.com/graphql",
    {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "imberg-dev-site",
      },
      body: JSON.stringify({
        query: `
          query GithubUserContributions($login: String!, $from: DateTime!, $to: DateTime!) {
            user(login: $login) {
              contributionsCollection(from: $from, to: $to) {
                contributionCalendar {
                  totalContributions
                }
              }
            }
          }
        `,
        variables: {
          from: start.toISOString(),
          login: username,
          to: end,
        },
      }),
    },
  );

  const total =
    data?.data?.user?.contributionsCollection?.contributionCalendar
      ?.totalContributions;

  return isPositiveNumber(total) ? formatCount(total) : undefined;
}

async function getTrackedCodingTime(): Promise<string | undefined> {
  const apiKey = process.env.WAKATIME_API_KEY?.trim();

  if (!apiKey) {
    return undefined;
  }

  const data = await safeJson<WakatimeResponse>(
    `https://wakatime.com/api/v1/users/current/all_time_since_today?api_key=${encodeURIComponent(apiKey)}`,
  );

  if (
    typeof data?.data?.text === "string" &&
    data.data.text.trim().length > 0 &&
    isPositiveNumber(data.data.total_seconds)
  ) {
    return data.data.text.trim();
  }

  return undefined;
}

async function getProductionDeploymentCount(
  repoUrl?: string,
): Promise<string | undefined> {
  const token =
    process.env.GITHUB_TOKEN?.trim() || process.env.GITHUB_API?.trim();
  const repository = parseGithubRepository(repoUrl);

  if (!token || !repository) {
    return undefined;
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${encodeURIComponent(repository.owner)}/${encodeURIComponent(repository.repo)}/deployments?environment=production&per_page=1`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "User-Agent": "imberg-dev-site",
        },
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      return undefined;
    }

    const deployments = (await response.json()) as unknown[];
    const linkHeader = response.headers.get("link");

    if (linkHeader) {
      const lastMatch = linkHeader.match(/[?&]page=(\d+)>; rel="last"/);

      if (lastMatch) {
        const pages = Number(lastMatch[1]);
        return Number.isFinite(pages) && pages > 0
          ? formatCount(pages)
          : undefined;
      }
    }

    return deployments.length > 0 ? formatCount(deployments.length) : undefined;
  } catch {
    return undefined;
  }
}

export function compactGithubStats(cards: GithubStatCard[]): Array<{
  key:
    | "publicRepos"
    | "contributionsYear"
    | "contributionsAllTime"
    | "codingTime"
    | "productionDeployments";
  label: string;
  value: string;
}> {
  return cards.filter(
    (
      card,
    ): card is {
      key:
        | "publicRepos"
        | "contributionsYear"
        | "contributionsAllTime"
        | "codingTime"
        | "productionDeployments";
      label: string;
      value: string;
    } =>
      typeof card.value === "string" && card.value.trim().length > 0,
  );
}

export async function getGithubSignalCards(
  githubUrl?: string,
  repoUrl?: string,
) {
  const username = parseGithubUsername(githubUrl);

  if (!username) {
    return [];
  }

  const [
    publicRepos,
    contributionsYear,
    contributionsAllTime,
    codingTime,
    productionDeployments,
  ] =
    await Promise.all([
      getPublicRepositoryCount(username),
      getContributionCount(username, "year"),
      getContributionCount(username, "allTime"),
      getTrackedCodingTime(),
      getProductionDeploymentCount(repoUrl),
    ]);

  return compactGithubStats([
    {
      key: "publicRepos",
      label: "Public repositories",
      value: publicRepos,
    },
    {
      key: "contributionsYear",
      label: "Contributions in the last year",
      value: contributionsYear,
    },
    {
      key: "contributionsAllTime",
      label: "All-time contributions",
      value: contributionsAllTime,
    },
    {
      key: "codingTime",
      label: "Tracked coding time",
      value: codingTime,
    },
    {
      key: "productionDeployments",
      label: "Production deployments",
      value: productionDeployments,
    },
  ]);
}
