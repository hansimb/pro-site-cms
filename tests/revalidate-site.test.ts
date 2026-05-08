import { describe, expect, it, vi } from "vitest";

const revalidatePathMock = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
}));

describe("revalidate public site", () => {
  it("revalidates the case study listing and detail routes", async () => {
    const { revalidatePublicSite } = await import(
      "../src/payload/hooks/revalidate-site"
    );

    await revalidatePublicSite();

    expect(revalidatePathMock).toHaveBeenCalledWith("/case-studies");
    expect(revalidatePathMock).toHaveBeenCalledWith(
      "/case-studies/[slug]",
      "page",
    );
  });
});
