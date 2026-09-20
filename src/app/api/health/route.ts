import { successResponse } from "@/server/response";

export async function GET() {
  return successResponse({
    service: "zyntarix-api",
    status: "ok",
    environment: process.env.NODE_ENV ?? "development",
    timestamp: new Date().toISOString(),
  });
}
