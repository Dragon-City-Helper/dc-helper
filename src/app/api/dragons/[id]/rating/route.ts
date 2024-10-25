import { saveDragonRatings } from "@/services/dragons";
import { Role } from "@prisma/client";
import { auth } from "@/auth";
import { HttpStatusCode } from "axios";
import { captureException } from "@sentry/nextjs";

export const PUT = auth(async (req, { params }) => {
  if (req.auth) {
    const userRole = req.auth.user.role;
    if (userRole === Role.GOD || userRole === Role.ADMIN) {
      try {
        const dragonId = params?.id as string;
        const { rating } = await req.json();
        if (dragonId) {
          try {
            const newRating = await saveDragonRatings(dragonId, rating);
            return Response.json({
              status: HttpStatusCode.Ok,
              data: newRating,
              message: `Saved ratings for dragon ${dragonId}`,
            });
          } catch (error) {
            captureException(error);
            return Response.json({
              status: HttpStatusCode.InternalServerError,
              data: null,
              message: "Interal Server Error",
            });
          }
        }
        return Response.json({
          status: HttpStatusCode.BadRequest,
          data: null,
          message: `Cannot read dragonId from path`,
        });
      } catch (error) {
        captureException(error);
        return Response.json({
          status: HttpStatusCode.InternalServerError,
          data: null,
          message: "Interal Server Error",
        });
      }
    }
    return Response.json({
      status: HttpStatusCode.Forbidden,
      data: null,
      message: "User not authorized to update ratings",
    });
  }
  return Response.json({
    status: HttpStatusCode.Unauthorized,
    data: null,
    message: "User not logged in",
  });
});
