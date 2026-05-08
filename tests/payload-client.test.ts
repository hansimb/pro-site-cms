import { beforeEach, describe, expect, it, vi } from "vitest";

const getPayloadMock = vi.fn();

vi.mock("payload", async (importOriginal) => {
  const actual = await importOriginal<typeof import("payload")>();

  return {
    ...actual,
    getPayload: getPayloadMock,
  };
});

describe("payload client", () => {
  beforeEach(() => {
    getPayloadMock.mockReset();
    vi.resetModules();
  });

  it("deduplicates concurrent payload initialization", async () => {
    let resolvePayload: ((value: { findGlobal: () => Promise<{}> }) => void) | undefined;

    getPayloadMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePayload = resolve;
        }),
    );

    const { getPayloadInstance } = await import(
      "../src/features/site/data/payload-client"
    );

    const firstCall = getPayloadInstance();
    const secondCall = getPayloadInstance();

    expect(getPayloadMock).toHaveBeenCalledTimes(1);

    const payloadInstance = {
      findGlobal: async () => ({}),
    };

    resolvePayload?.(payloadInstance);

    await expect(firstCall).resolves.toBe(payloadInstance);
    await expect(secondCall).resolves.toBe(payloadInstance);
  });
});
