import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";
import CryptoJS from "crypto-js";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
    body: { name, price, description },
  } = req;
  if (req.method === "GET") {
    const streams = await client.stream.findMany();
    res.json({ ok: true, streams });
  } else if (req.method === "POST") {
    const timestamp = String(Date.now());
    //** NCP Live Station 채널을 만드는 요청을 한 뒤, 채널의 ID를 응답으로 받아옴 */
    const {
      content: { channelId },
    } = await fetch(`https://livestation.apigw.ntruss.com/api/v2/channels`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-ncp-apigw-timestamp": timestamp,
        "x-ncp-iam-access-key": `${process.env.NAVER_CLOUD_API_ACCESS_KEY}`,
        "x-ncp-apigw-signature-v2": `${makeSignature(
          timestamp,
          "POST",
          "/api/v2/channels"
        )}`,
        "x-ncp-region_code": "KR",
      },
      body: JSON.stringify({
        channelName: `${name}`,
        cdn: {
          createCdn: true,
          cdnType: "CDN_PLUS",
        },
        qualitySetId: 3,
        useDvr: false,
        record: {
          type: "MANUAL_UPLOAD",
        },
      }),
    }).then((data) => data.json());

    //* NCP Live Station 채널 정보를 요청한 뒤, 채널의 key와 url을 응답으로 받아옴 */
    const {
      content: {
        streamKey,
        publishUrl,
        cdn: { cdnDomain },
      },
    } = await fetch(
      `https://livestation.apigw.ntruss.com/api/v2/channels/${channelId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-ncp-apigw-timestamp": timestamp,
          "x-ncp-iam-access-key": `${process.env.NAVER_CLOUD_API_ACCESS_KEY}`,
          "x-ncp-apigw-signature-v2": `${makeSignature(
            timestamp,
            "GET",
            `/api/v2/channels/${channelId}`
          )}`,
          "x-ncp-region_code": "KR",
        },
      }
    ).then((data) => data.json());
    const stream = await client.stream.create({
      data: {
        ncpLiveId: channelId,
        ncpLiveKey: streamKey,
        ncpLiveUrl: publishUrl,
        cdnDomain: cdnDomain,
        name,
        price,
        description,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    res.json({ ok: true, stream });
  }
}

function makeSignature(ts: string, method: string, url: string) {
  var space = " "; // one space
  var newLine = "\n"; // new line
  var method = method; // method
  var url = url; // url (include query string)
  var timestamp = ts; // current timestamp (epoch)
  var accessKey = `${process.env.NAVER_CLOUD_API_ACCESS_KEY}`; // access key id (from portal or Sub Account)
  var secretKey = `${process.env.NAVER_CLOUD_API_SECRET_KEY}`; // secret key (from portal or Sub Account)

  var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
  hmac.update(method);
  hmac.update(space);
  hmac.update(url);
  hmac.update(newLine);
  hmac.update(timestamp);
  hmac.update(newLine);
  hmac.update(accessKey);

  var hash = hmac.finalize();

  return hash.toString(CryptoJS.enc.Base64);
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
