import createAuthorization, { timeStamp } from './naverAuthorization';

const endPoint = 'https://kr.object.ncloudstorage.com';
const bucketName = 'carrot-market-clone-bucket';

export default async function objectStorageFn(
  method: string,
  objectName: string
) {
  const response = await fetch(`${endPoint}/${bucketName}/${objectName}`, {
    method,
    headers: {
      Authorization: createAuthorization(method, `${bucketName}/${objectName}`),
      'x-amz-date': timeStamp,
      Host: endPoint,
    },
  })
    .then((data) => data.json())
    .then((data) => console.log('성공', data))
    .catch((error) => console.log('실패', error));
  return response;
}
