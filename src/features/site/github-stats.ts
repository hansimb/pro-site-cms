export type GithubStatCard = {
  key: "publicRepos" | "contributions" | "codingTime";
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
): Promise<string | undefined> {
  const token =
    process.env.GITHUB_TOKEN?.trim() || process.env.GITHUB_API?.trim();

  if (!token) {
    return undefined;
  }

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
          query GithubUserContributions($login: String!) {
            user(login: $login) {
              contributionsCollection {
                contributionCalendar {
                  totalContributions
                }
              }
            }
          }
        `,
        variables: {
          login: username,
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

export function compactGithubStats(cards: GithubStatCard[]): Array<{
  key: "publicRepos" | "contributions" | "codingTime";
  label: string;
  value: string;
}> {
  return cards.filter(
    (
      card,
    ): card is {
      key: "publicRepos" | "contributions" | "codingTime";
      label: string;
      value: string;
    } =>
      typeof card.value === "string" && card.value.trim().length > 0,
  );
}

export async function getGithubSignalCards(githubUrl?: string) {
  const username = parseGithubUsername(githubUrl);

  if (!username) {
    return [];
  }

  const [publicRepos, contributions, codingTime] = await Promise.all([
    getPublicRepositoryCount(username),
    getContributionCount(username),
    getTrackedCodingTime(),
  ]);

  return compactGithubStats([
    {
      key: "publicRepos",
      label: "Public repositories",
      value: publicRepos,
    },
    {
      key: "contributions",
      label: "Contributions",
      value: contributions,
    },
    {
      key: "codingTime",
      label: "Tracked coding time",
      value: codingTime,
    },
  ]);
}
