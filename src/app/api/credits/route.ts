import { db } from "@/server/db";
import { successResponse, errorResponse } from "@/server/response";

export async function GET() {
  try {
    const user = await db.user.findFirst({
      select: {
        id: true,
        creditAccount: {
          select: {
            available: true,
            reserved: true,
            used: true,
          },
        },
      },
    });

    if (!user) {
      return errorResponse(
        "No account is available for credit lookup.",
        404
      );
    }

    return successResponse({
      userId: user.id,
      credits: user.creditAccount ?? {
        available: 0,
        reserved: 0,
        used: 0,
      },
    });
  } catch {
    return errorResponse(
      "Unable to load credit information from the database.",
      500
    );
  }
}
