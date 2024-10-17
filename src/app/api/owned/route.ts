import { fetchOwned, setOwnedIds } from "@/services/owned";
import { auth } from "@/../auth";
import { HttpStatusCode } from "axios";
import { captureException, captureMessage } from "@sentry/nextjs";

export const GET = auth(async (req) => {
  if (req.auth) {
    try {
      const ownedDragons = await fetchOwned(req.auth.user.id);
      if (ownedDragons) {
        return Response.json({
          status: HttpStatusCode.Ok,
          data: ownedDragons.dragons,
          message: "fetched all the dragons owned",
        });
      } else {
        return Response.json({
          status: HttpStatusCode.NotFound,
          data: [],
          message: "no dragons found",
        });
      }
    } catch (error) {
      captureException(error);
      return Response.json({
        status: HttpStatusCode.InternalServerError,
        data: null,
        message: "Interal Server Error",
      });
    }
  }
  captureMessage("User not logged in");
  return Response.json({
    status: HttpStatusCode.Unauthorized,
    data: null,
    message: "User not logged in",
  });
});

export const POST = auth(async (req) => {
  if (req.auth) {
    try {
      const { ownedIds } = await req.json();
      try {
        const userId = req.auth.user.id;
        const ownedDragons = await setOwnedIds(userId, ownedIds);
        return Response.json({
          status: HttpStatusCode.Ok,
          data: ownedDragons.dragons,
          message: "saved owned dragons successfully.",
        });
      } catch (error) {
        captureException(error);
        return Response.json({
          status: HttpStatusCode.InternalServerError,
          data: null,
          message: "Failed to save owned dragons",
        });
      }
    } catch (error) {
      captureException(error);
      return Response.json({
        status: HttpStatusCode.BadRequest,
        data: null,
        message: "Cannot parse ownedIds",
      });
    }
  }
  captureMessage("User not logged in");
  return Response.json({
    status: HttpStatusCode.Unauthorized,
    data: null,
    message: "User not logged in",
  });
});
