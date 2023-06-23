import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";
import AWS from "aws-sdk";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const endpoint = new AWS.Endpoint("https://kr.object.ncloudstorage.com");
  const region = "kr-standard";
  const accessKey = process.env.NAVER_CLOUD_API_ACCESS_KEY + "";
  const secretKey = process.env.NAVER_CLOUD_API_SECRET_KEY + "";

  const S3 = new AWS.S3({
    endpoint: endpoint.href,
    region,
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    },
  });

  const bucketName = "carrot-market-clone-bucket";
  const imgFile = req.body;

  const form = formidable({});

  await form.parse(req, (err, fields, files) => {
    console.log(files.file);
  });

  // (async () => {
  //   let objectName = "샘플 파일.png";

  //   await S3.putObject({
  //     Bucket: bucketName,
  //     Key: objectName,
  //     Body: imgFile,
  //   }).promise();
  // })();

  res.json({ ok: true });
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
