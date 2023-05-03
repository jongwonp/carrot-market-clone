import withHandler from '@/libs/server/withHandler';
import { NextApiResponse } from 'next';
import { NextApiRequestQuery } from 'next/dist/server/api-utils';

async function handler(req: NextApiRequestQuery, res: NextApiResponse) {
  console.log(req.body);
  res.status(200).end();
}

export default withHandler('POST', handler);
