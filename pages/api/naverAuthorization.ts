import CryptoJS from 'crypto-js';

const accessKey = process.env.NAVER_CLOUD_API_ACCESS_KEY;
const secretKey = process.env.NAVER_CLOUD_API_SECRET_KEY;
const regionName = 'kr-standard';
const requestType = 'aws4_request';
const serviceName = 's3';
const hashingAlgorithm = 'AWS4-HMAC-SHA256';

const date = new Date();
const year = String(date.getFullYear());
const month = String(('0' + (date.getMonth() + 1)).slice(-2));
const day = String(('0' + date.getDate()).slice(-2));
const hour = String(('0' + date.getHours()).slice(-2));
const minute = String(('0' + date.getMinutes()).slice(-2));
const second = String(('0' + date.getSeconds()).slice(-2));
const yyyymmddDate = year + month + day;
export const timeStamp = `${year}${month}${day}T${hour}${minute}${second}Z`;

const scope =
  yyyymmddDate + '/' + regionName + '/' + serviceName + '/' + requestType;

function createSignedHeaders(headerKeyList: string[]): string {
  let signedHeaders = [
    ...headerKeyList.map((header) => header.toLocaleLowerCase()),
  ];
  signedHeaders.sort();

  return signedHeaders.join(';');
}
function createCanonicalHeaders(
  headerKeyList: string[],
  headerValueList: string[]
): string {
  let canonicalHeaders = '';
  for (let i = 0; i < headerKeyList.length; i++) {
    canonicalHeaders =
      canonicalHeaders +
      headerKeyList[i].toLowerCase() +
      ':' +
      headerValueList[i].trim() +
      '\n';
  }
  return canonicalHeaders;
}

export default function createAuthorization(
  httpMethod: string,
  headerKeyList: string[],
  headerValueList: string[]
) {
  const signedHeaders = createSignedHeaders(headerKeyList);

  // 1) 표준화 요청 생성 (Canonical Request)
  function createCanonicalRequest() {
    // <CanonicalURI>\n             접근하려는 리소스 URI-encoded로 정의 ex) /path/object
    const canonicalURI = encodeURI('/carrot-market-clone-bucket/시험용파일');

    // <CanonicalQueryString>\n     요청 파라미터가 있다면 URI-encoded로 정의 후 알파벳순 나열
    const canonicalQueryString = '';

    // <CanonicalHeaders>\n         요청 헤더 이름과 값을 URI-encoded로 정의. 헤더이름은 소문자에 앞 뒤 공백 제거. 각 헤더 항목의 끝에 \n 삽입.
    //                              헤더 이름으로 알파벳순 정렬되어야 함.
    const canonicalHeaders = createCanonicalHeaders(
      headerKeyList,
      headerValueList
    );

    // <SignedHeaders>\n
    // 요청에 포함된 헤더 이름을 나열. 헤더 이름은 모두 소문자로 변환하고 알파벳순으로 정렬. 각 헤더 이름의 구분자로 세미콜론(";")을 입력

    // <HashedPayload>    payload의 SHA256 해쉬의 16진수 값.
    // payload가 없다면 빈 문자열, 페이로드를 서명하지 않으려면 'UNSIGNED-PAYLOAD'
    const hashedPayload = CryptoJS.SHA256('').toString();

    return (
      httpMethod +
      '\n' +
      canonicalURI +
      '\n' +
      canonicalQueryString +
      '\n' +
      canonicalHeaders +
      '\n' +
      signedHeaders +
      '\n' +
      hashedPayload
    );
  }

  // 2) 서명할 문자열 생성 (String to Sign)
  function createStringToSign() {
    // Hex(SHA256Hash(<CanonicalRequest>))
    // '1) 표준화 요청'의  SHA256 해쉬의 16진수 값
    const hashedCanonicalRequest = CryptoJS.SHA256(
      createCanonicalRequest()
    ).toString();

    return (
      hashingAlgorithm +
      '\n' +
      timeStamp +
      '\n' +
      scope +
      '\n' +
      hashedCanonicalRequest
    );
  }

  // 3) 서명키 생성 (Signing Key)
  function createSigningKey() {
    // kDate       = HMAC-SHA256("AWS4" + kSecret, <Date>) date는 YYYYMMDD 형식
    const keyDate = CryptoJS.HmacSHA256(yyyymmddDate, 'AWS4' + secretKey);

    // kRegion     = HMAC-SHA256(kDate, <Region>) regionName 사용
    const keyRegion = CryptoJS.HmacSHA256(regionName, keyDate);

    // kService    = HMAC-SHA256(kRegion, "s3")
    const keyService = CryptoJS.HmacSHA256(serviceName, keyRegion);

    // kSigning = HMAC - SHA256(kService, 'aws4_request');
    const keySigning = CryptoJS.HmacSHA256(requestType, keyService);

    return keySigning;
  }

  // 4) 서명 생성 (Signature)
  function createSignature() {
    //  Hex(HMAC-SHA256(<SigningKey>, <StringToSign>))
    return CryptoJS.HmacSHA256(
      createStringToSign(),
      createSigningKey()
    ).toString();
  }

  // 5) 인증 헤더 생성 (Authorization)
  // Authorization: AWS4-HMAC-SHA256 Credential=<AccessKeyID>/<Scope>, SignedHeaders=<SignedHeaders>, Signature=<Signature>
  const signature = createSignature();

  return (
    hashingAlgorithm +
    ' ' +
    'Credential=' +
    accessKey +
    '/' +
    scope +
    ',' +
    'SignedHeaders=' +
    signedHeaders +
    ',' +
    'Signature=' +
    signature
  );
}
