import { NextApiRequest, NextApiResponse } from "next";
import { NextConnect } from "next-connect";

export default function routes(
  api: NextConnect<NextApiRequest, NextApiResponse>
) {
  return api;
}
