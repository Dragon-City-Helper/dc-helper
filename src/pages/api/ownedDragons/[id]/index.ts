import { fetchOwned, setOwnedIds } from "@/services/ownedDragons";
import { ownedDragons } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData =
  | ownedDragons
  | {
      message?: string;
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "GET") {
    try {
      const ownedDragons = await fetchOwned();
      res.status(200).json(ownedDragons);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  } else if (req.method === "POST") {
    const { ownedIds } = req.body;
    try {
      const ownedDragons = await setOwnedIds(ownedIds);
      res.status(200).json(ownedDragons);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405);
  }
}
