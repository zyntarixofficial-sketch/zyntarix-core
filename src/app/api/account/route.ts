import { db } from "@/server/db";
import { successResponse, errorResponse } from "@/server/response";

export async function GET() {
  try {
    const user = await db.user.findFirst({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        planId: true,
        createdAt: true,
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
      return errorResponse("No authenticated account data is available.", 404);
    }

    return successResponse({
      account: user,
    });
  } catch {
    return errorResponse(
      "Unable to load account data from the database.",
      500
    );
  }
}
