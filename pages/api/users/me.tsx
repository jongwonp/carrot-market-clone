import client from '@/libs/server/client';
import { withIronSessionApiRoute } from 'iron-session/next';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import { NextApiRequest, NextApiResponse } from 'next';

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const profile = await client.user.findUnique({
    where: { id: req.session.user?.id },
  });

  res.json({
    ok: true,
    profile,
  });
}

export default withIronSessionApiRoute(withHandler('GET', handler), {
  cookieName: 'carrotsession',
  password: '1232450294058402981231243235253245643669346214124',
});
