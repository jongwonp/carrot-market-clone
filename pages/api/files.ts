import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";
import AWS from "aws-sdk";
import formidable from "formidable";
import fs from "fs";

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

  // NAVER가 사용하는 API와 호환되는 AWS의 API를 사용해서 사진 업로드할 예정
  const S3 = new AWS.S3({
    endpoint: endpoint.href,
    region,
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    },
  });

  const bucketName = "carrot-market-clone-bucket";

  // req의 body의 내용인 formData parsing을 위해 외부 라이브러리 formidable 사용
  const form = formidable({});
  const [fields, files] = await form.parse(req);

  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const date = today.getDate();

  let objectName = `${year}${month}${date}_${Date.now()}.png`;

  const response = S3.putObject({
    Bucket: bucketName,
    Key: objectName,
    Body: fs.createReadStream(files.file[0].filepath),
    ContentType: "image/png",
  }).promise();

  res.json({ ok: true, fileName: objectName });
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
