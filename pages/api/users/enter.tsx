import client from '@/libs/server/client';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import { NextApiRequest, NextApiResponse } from 'next';
import messagingFn from './naverSMS';
import emailingFn from './naverEmail';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email } = req.body;
  const user = phone ? { phone: +phone } : email ? { email } : null;
  if (!user) return res.status(400).json({ ok: false });
  const payload = Math.floor(100000 + Math.random() * 900000) + '';
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            name: 'Anonymous',
            ...user,
          },
        },
      },
    },
  });
  if (phone) {
    const message = messagingFn({
      type: 'SMS',
      from: `${process.env.MY_PHONE}`,
      content: 'Hello from test',
      messages: [{ to: `${process.env.MY_PHONE}` }],
    });
  }
  if (email) {
    const email = emailingFn({
      senderAddress: 'jw03287@naver.com',
      title: '테스트용 이메일 제목',
      body: '테스트용 이메일 내용',
      recipients: [
        {
          address: 'jw032876@gmail.com',
          name: 'jwp',
          type: 'R',
        },
      ],
      unsubscribeMessage: '사용자 정의 수신 거부 문구',
    });
  }
}

export default withHandler('POST', handler);
