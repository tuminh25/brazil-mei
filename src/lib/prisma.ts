// src/lib/prisma.ts
// SINGLE runtime PrismaClient singleton for the whole Next.js app.
// All pages, route handlers, server actions and data-access modules must
// import this module — never construct PrismaClient elsewhere.
import { PrismaClient } from "@prisma/client";

/**
 * Conservative pool defaults for Next.js serverless (Vercel) + Neon Free.
 *
 * Why: every warm serverless instance gets its own PrismaClient with its own
 * connection pool. Without `connection_limit` Prisma's default pool size is
 * (physical CPUs x 2) + 1 per instance, so a burst of concurrent function
 * instances multiplies into hundreds/thousands of PostgreSQL connections at
 * Neon. These caps keep each instance to a small, bounded number of pooled
 * connections.
 */
const POOL_DEFAULTS: Record<string, string> = {
  // Max DB connections per serverless instance (was: unlimited/default ~5-9).
  connection_limit: "3",
  // Fail fast instead of stacking queries when the local pool is busy.
  pool_timeout: "10",
  connect_timeout: "10",
  // Neon's pooled endpoint is PgBouncer in transaction mode; required so
  // Prisma avoids session-level prepared statements that break pooling.
  pgbouncer: "true",
};

export function withPoolParams(rawUrl?: string): string | undefined {
  if (!rawUrl || !rawUrl.includes("://")) return rawUrl;

  const [base, query] = rawUrl.split("?");
  const params = new URLSearchParams(query ?? "");
  for (const [key, value] of Object.entries(POOL_DEFAULTS)) {
    if (!params.has(key)) params.set(key, value);
  }
  return `${base}?${params.toString()}`;
}

function prismaClientSingleton() {
  return new PrismaClient({
    datasourceUrl: withPoolParams(process.env.DATABASE_URL),
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
