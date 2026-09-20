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
        "No account is available for Stack lookup.",
        404
      );
    }

    const stackDays = await db.stackDay.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        activityDate: "desc",
      },
      take: 7,
      select: {
        id: true,
        day: true,
        activityDate: true,
        completed: true,
        rewardGranted: true,
        rewardCredits: true,
      },
    });

    return successResponse({
      stackDays,
    });
  } catch {
    return errorResponse(
      "Unable to load Stack information from the database.",
      500
    );
  }
}
