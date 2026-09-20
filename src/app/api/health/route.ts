import { db } from "@/server/db";
import { successResponse, errorResponse } from "@/server/response";

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;

    return successResponse({
      service: "zyntarix-api",
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch {
    return errorResponse(
      "Database connection is unavailable.",
      503
    );
  }
}
