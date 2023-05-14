import client from '@/libs/server/client';
import { withIronSessionApiRoute } from 'iron-session/next';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { token } = req.body;
  const exist = await client.token.findUnique({
    where: {
      payload: token,
    },
  });
  if (!exist) res.status(404).end();
  req.session.user = {
    id: exist?.userId,
  };
  await req.session.save();
  res.status(200).end();
}

export default withIronSessionApiRoute(withHandler('POST', handler), {
  cookieName: 'carrotsession',
  password: '1232450294058402981231243235253245643669346214124',
});
