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
        "No account is available for credit history.",
        404
      );
    }

    const transactions = await db.creditTransaction.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        type: true,
        status: true,
        amount: true,
        description: true,
        projectId: true,
        jobId: true,
        createdAt: true,
      },
    });

    return successResponse({
      transactions,
    });
  } catch {
    return errorResponse(
      "Unable to load credit history from the database.",
      500
    );
  }
}
