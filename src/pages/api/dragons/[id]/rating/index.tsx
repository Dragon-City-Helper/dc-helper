import { saveDragonRatings } from "@/services/dragons";
import { Rating } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData =
  | Rating
  | {
      message?: string;
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "PUT") {
    const { id: dragonsId } = req.query;
    const { rating } = req.body;
    try {
      const response = await saveDragonRatings(dragonsId as string, rating);
      return res.send(response);
    } catch (error) {
      res.status(500).json({ message: "internal server error" });
    }
  } else {
    res.status(405);
  }
}
