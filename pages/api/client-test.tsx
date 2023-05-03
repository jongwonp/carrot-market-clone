import client from '@/libs/client';
import { NextApiResponse } from 'next';
import { NextApiRequestQuery } from 'next/dist/server/api-utils';

export default async function handler(
  req: NextApiRequestQuery,
  res: NextApiResponse
) {
  await client.user.create({
    data: {
      email: 'abc',
      name: 'hi',
    },
  });

  res.json({
    ok: true,
  });
}
