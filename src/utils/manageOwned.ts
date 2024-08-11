import { kv } from "@vercel/kv";
import axios from "axios";

export const fetchOwned = async () => {
  const ownedIdsFromSource = await kv.get<number[]>("ownedIds");
  return ownedIdsFromSource;
};

export const setOwnedIds = async (ownedIds: number[]) => {
  return kv.set("ownedIds", ownedIds);
};

export const postOwned = async (ownedIds: number[]) => {
  return axios.post("/api/save-owned-ids", { ownedIds });
};
