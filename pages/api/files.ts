import withHandler, { ResponseType } from '@/libs/server/withHandler';
import { NextApiRequest, NextApiResponse } from 'next';
import { withApiSession } from '@/libs/server/withSession';
import createAuthorization, { timeStamp } from './naverAuthorization';
import CryptoJS from 'crypto-js';

// 강의대로라면 CF에 GET요청으로 이미지를 업로드할 URL을 받는 API핸들러.
// naver에서는 object storage에 put 요청으로 업로드해야하니 PutObject를 하면 될듯?

// const headers = new Headers();
// headers.append('Content-Length', 'application/json');
// headers.append('Host', 'https://kr.object.ncloudstorage.com');
// headers.append('x-amz-date', `${timeStamp}`);
// headers.append('x-amz-content-sha256', CryptoJS.SHA256());

// const headerKeyList: string[] = [];
// const headerValueList: string[] = [];

// for (const key of headers.keys()) {
//   headerKeyList.push(key);
// }
// for (const value of headers.values()) {
//   headerValueList.push(value);
// }

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  console.log(req.body);
  // const response = await (
  //   await fetch(`${headers.get('Host')}/carrot-market-clone-bucket/`, {
  //     method: 'POST',
  //     headers: {
  //       ...headers,
  //       Authorization: createAuthorization(
  //         'POST',
  //         headerKeyList,
  //         headerValueList
  //       ),
  //     },
  //     body: JSON.stringify({}),
  //   })
  // ).json();
  // res.json({
  //   ok: true,
  //   url: '',
  // });
  res.json({ ok: true, data: 'fetch결과 edit.tsx에서 돌려받기' });
}

export default withApiSession(
  withHandler({ methods: ['GET', 'POST'], handler })
);
