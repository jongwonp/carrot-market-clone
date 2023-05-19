import CryptoJS from 'crypto-js';

const endpoint = 'https://mail.apigw.ntruss.com/api/v1';

export interface EmailDataType {
  senderAddress: string;
  senderName?: string;
  templateSid?: number;
  title: string;
  body: string;
  individual?: boolean;
  confirmAndSend?: boolean;
  advertising?: boolean;
  parameters?: object;
  referencesHeader?: string;
  reservationUtc?: number;
  reservationDateTime?: string;
  attachFileIds?: string[];
  recipients: {
    address: string;
    name?: string;
    type: string;
    parameters?: object;
  }[];
  recipientGroupFilter?: { andFilter: boolean; groups: string[] };
  useBasicUnsubscribeMsg?: boolean;
  unsubscribeMessage: string;
}

export default async function emailingFn(emailData: EmailDataType) {
  const timestamp = String(Date.now());
  const response = await fetch(`${endpoint}/mails`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-ncp-apigw-timestamp': timestamp,
      'x-ncp-iam-access-key': `${process.env.NAVER_CLOUD_API_ACCESS_KEY}`,
      'x-ncp-apigw-signature-v2': `${makeSignature(timestamp)}`,
    },
    body: JSON.stringify(emailData),
  })
    .then((data) => data.json())
    .then((data) => console.log('Email 성공', data))
    .catch((error) => console.log('Email 실패', error));
  return response;
}

function makeSignature(ts: string) {
  var space = ' ';
  var newLine = '\n';
  var method = 'POST';
  var url = `/api/v1/mails`;
  var timestamp = ts;
  var accessKey = `${process.env.NAVER_CLOUD_API_ACCESS_KEY}`;
  var secretKey = `${process.env.NAVER_CLOUD_API_SECRET_KEY}`;

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
