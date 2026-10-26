import assert from "node:assert/strict";
import type { Server } from "node:http";
import { after, before, test } from "node:test";
import express from "express";
import { LOCAL_USER_ID } from "../src/config/constants";
import { prisma } from "../src/lib/prisma";
import { apiRouter } from "../src/routes/api";

let server: Server;
let baseUrl: string;
let olderId: string;
let newerId: string;
let otherUserId: string;

before(async () => {
  const older = await prisma.project.create({
    data: {
      name: "older-project",
      userId: LOCAL_USER_ID,
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
    },
  });
  const newer = await prisma.project.create({
    data: {
      name: "newer-project",
      userId: LOCAL_USER_ID,
      createdAt: new Date("2025-01-01T00:00:00.000Z"),
    },
  });
  const other = await prisma.project.create({
    data: {
      name: "other-user-project",
      userId: "other-user",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    },
  });
  olderId = older.id;
  newerId = newer.id;
  otherUserId = other.id;

  const app = express();
  app.use(express.json());
  app.use("/api", apiRouter);

  await new Promise<void>((resolve) => {
    server = app.listen(0, () => resolve());
  });
  const address = server.address();
  assert(address && typeof address === "object");
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await prisma.project.deleteMany({
    where: { id: { in: [olderId, newerId, otherUserId] } },
  });
  await new Promise<void>((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
  await prisma.$disconnect();
});

test("GET /api/projects returns the local user's projects, newest first", async () => {
  const res = await fetch(`${baseUrl}/api/projects`);
  assert.equal(res.status, 200);

  const body = (await res.json()) as {
    data: Array<{
      id: string;
      name: string;
      userId: string;
      createdAt: string;
      updatedAt: string;
    }>;
  };

  assert.ok(Array.isArray(body.data), "response should have a data array");

  const ids = body.data.map((p) => p.id);
  assert.ok(ids.includes(olderId), "should include the older project");
  assert.ok(ids.includes(newerId), "should include the newer project");
  assert.ok(
    !ids.includes(otherUserId),
    "should not include another user's project",
  );
  assert.ok(
    ids.indexOf(newerId) < ids.indexOf(olderId),
    "newer project should come before older project",
  );

  const newer = body.data.find((p) => p.id === newerId);
  assert.equal(newer?.name, "newer-project");
  assert.equal(newer?.userId, LOCAL_USER_ID);
  assert.ok(newer?.createdAt, "project should have createdAt");
  assert.ok(newer?.updatedAt, "project should have updatedAt");
});
