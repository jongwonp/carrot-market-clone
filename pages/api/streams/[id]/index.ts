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
    query: { id },
    session: { user },
  } = req;
  const stream = await client.stream.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      messages: {
        select: {
          id: true,
          message: true,
          user: {
            select: {
              avatar: true,
              id: true,
            },
          },
        },
      },
    },
  });

  const timestamp = String(Date.now());
  const { content } = await fetch(
    `https://livestation.apigw.ntruss.com/api/v2/channels/${stream?.ncpLiveId}/serviceUrls?serviceUrlType=GENERAL`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-ncp-apigw-timestamp": timestamp,
        "x-ncp-iam-access-key": `${process.env.NAVER_CLOUD_API_ACCESS_KEY}`,
        "x-ncp-apigw-signature-v2": `${makeSignature(
          timestamp,
          "GET",
          `/api/v2/channels/${stream?.ncpLiveId}/serviceUrls?serviceUrlType=GENERAL`
        )}`,
        "x-ncp-region_code": "KR",
      },
    }
  ).then((data) => data.json());

  const isOwner = stream?.userId === user?.id;
  if (stream && !isOwner) {
    stream.ncpLiveKey = "xxxxx";
    stream.ncpLiveUrl = "xxxxx";
  }
  res.json({ ok: true, stream, content });
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

export default withApiSession(withHandler({ methods: ["GET"], handler }));
