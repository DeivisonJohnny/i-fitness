import { NextApiRequest as Request } from "next";

declare module "next" {
  export interface NextApiRequest extends Request {
    params: { [key: string]: string };

    userId: string;

    file?: File;
    files?: File[];
  }
}
