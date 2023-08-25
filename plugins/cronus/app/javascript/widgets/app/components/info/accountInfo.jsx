import React, { useState, useEffect } from 'react';
import { CodeBlock } from 'juno-ui-components';
function AccountInfo() {

  const [accountInfo, setAccountInfo] = useState({});
  const url = 'https://cronus.qa-de-2.cloud.sap/v2/email/account/';
  let myHeaders = new Headers();
  myHeaders.append(
    'X-Auth-Token',
    ''
  );
  myHeaders.append('X-Amz-Date', '20230810T015117Z');
  myHeaders.append(
    'Authorization',
    'AWS4-HMAC-SHA256 Credential=4ed7bc660afd4d40ad8da6c600cc78fa/20230810/eu-central-1/ses/aws4_request, SignedHeaders=host;x-amz-date;x-auth-token, Signature=a7912b0c6f2811c5ec9ef570fa207db50e03b1d5e10fb23f0d4da9acfad226bd'
  );

  let requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };
  useEffect(function () {
    async function fetchAccountInfo() {
      try {
        const res = await fetch(url, requestOptions);
        const data = await res.json();
        setAccountInfo(data);
      } catch (e) {
        console.log('error', e);
      } finally {
        console.log('finally...');
      }
    }
    fetchAccountInfo();
    return function () {
      console.log('clean up');
    };
  }, []);
  return (
    <CodeBlock size="large">
      <>{JSON.stringify(accountInfo, null, 2)}</>
    </CodeBlock>
  );
}

export default AccountInfo;
