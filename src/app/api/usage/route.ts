import { db } from "@/server/db";
import { successResponse, errorResponse } from "@/server/response";

export async function GET() {
  try {
    const user = await db.user.findFirst({
      select: {
        id: true,
      },
    });

    if (!user) {
      return errorResponse(
        "No account is available for usage lookup.",
        404
      );
    }

    const usage = await db.usageRecord.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
      select: {
        id: true,
        projectId: true,
        jobId: true,
        action: true,
        units: true,
        metadata: true,
        createdAt: true,
      },
    });

    return successResponse({
      usage,
    });
  } catch {
    return errorResponse(
      "Unable to load usage information from the database.",
      500
    );
  }
}
