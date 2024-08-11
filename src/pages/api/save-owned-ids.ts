import { setOwnedIds } from "@/utils/manageOwned";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  ownedIds?: number[];
  message?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    const { ownedIds } = req.body;
    try {
      setOwnedIds(ownedIds);
      res.status(200).json({ ownedIds });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405);
  }
}
