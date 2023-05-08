import CryptoJS from 'crypto-js';

const mainUrl = 'https://sens.apigw.ntruss.com';

export interface MessageDataType {
  type: 'SMS' | 'LMS' | 'MMS';
  contentType?: 'COMM' | 'AD';
  countryCode?: string;
  from: string;
  subject?: string;
  content: string;
  messages: [
    {
      to: string;
      subject?: string;
      content?: string;
    }
  ];
  files?: [
    {
      fileId?: string;
    }
  ];
  reserveTime?: 'yyyy-MM-dd HH:mm';
  reserveTimeZone?: string;
  scheduleCode?: string;
}

export default async function messagingFn(messageData: MessageDataType) {
  const timestamp = String(Date.now());
  const response = await fetch(
    `${mainUrl}/sms/v2/services/${process.env.NAVER_CLOUD_SENS_SMS_SERVICE_ID}/messages`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-ncp-apigw-timestamp': timestamp,
        'x-ncp-iam-access-key': `${process.env.NAVER_CLOUD_API_ACCESS_KEY}`,
        'x-ncp-apigw-signature-v2': `${makeSignature(timestamp)}`,
      },
      body: JSON.stringify(messageData),
    }
  )
    .then((data) => data.json())
    .then((data) => console.log('SMS성공', data))
    .catch((error) => console.log('SMS실패', error));
  return response;
}

function makeSignature(ts: string) {
  var space = ' ';
  var newLine = '\n';
  var method = 'POST';
  var url = `/sms/v2/services/${process.env.NAVER_CLOUD_SENS_SMS_SERVICE_ID}/messages`;
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
