import { db } from "@/server/db";
import { successResponse, errorResponse } from "@/server/response";

export async function GET() {
  try {
    const projects = await db.project.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return successResponse({
      projects,
    });
  } catch {
    return errorResponse(
      "Unable to load projects from the database.",
      500
    );
  }
}
