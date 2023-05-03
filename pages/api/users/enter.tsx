import { NextApiResponse } from 'next';
import { NextApiRequestQuery } from 'next/dist/server/api-utils';

export default async function handler(
  req: NextApiRequestQuery,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(401).end();
  }
  console.log(req.body);
  res.status(200).end();
}
