import { beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { defaultHomeDocument } from "../src/lib/content/defaults";
import { createAdminSessionValue } from "../src/lib/auth/admin-session";
import { POST as saveHomePost } from "../src/app/api/admin/home/route";

describe("admin home api", () => {
  beforeEach(() => {
    process.env.ADMIN_PASSWORD = "super-secret";
  });

  it("rejects unauthenticated home save requests", async () => {
    const request = new NextRequest("http://localhost:3000/api/admin/home", {
      method: "POST",
      body: JSON.stringify(defaultHomeDocument),
      headers: {
        "content-type": "application/json",
      },
    });

    const response = await saveHomePost(request);

    expect(response.status).toBe(401);
  });

  it("rejects invalid home payloads even for authenticated admins", async () => {
    const request = new NextRequest("http://localhost:3000/api/admin/home", {
      method: "POST",
      body: JSON.stringify({
        blocks: [
          {
            id: "bad-1",
            type: "unknown",
            visible: true,
          },
        ],
      }),
      headers: {
        "content-type": "application/json",
        cookie: `pro-site-cms-admin=${createAdminSessionValue("super-secret")}`,
      },
    });

    const response = await saveHomePost(request);

    expect(response.status).toBe(400);
  });
});
