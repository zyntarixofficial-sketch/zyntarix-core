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
        "No account is available for project status lookup.",
        404
      );
    }

    const projects = await db.project.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        name: true,
        status: true,
        updatedAt: true,
      },
    });

    return successResponse({
      projects,
    });
  } catch {
    return errorResponse(
      "Unable to load project status from the database.",
      500
    );
  }
}
