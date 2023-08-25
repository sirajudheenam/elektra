
import {
  DataList,
  DataListRow,
  DataListCell,
  ContentArea,
  ContentAreaHeading,
} from 'juno-ui-components';
import React, { useEffect, useState } from 'react';

import rawdata from '../../data/awsAccount.json';
// import { randomUUID } from 'crypto';


function AccountDetails({ details }) {
  return (
    details ? (
      <>
        <DataListRow>
          <DataListCell cols={4}>
            Additional Contact Email Addresses
          </DataListCell>
          <DataListCell cols={4}>
            {`${details?.AdditionalContactEmailAddresses}`}
          </DataListCell>
        </DataListRow>
        <DataListRow>
          <DataListCell cols={4}>Contact Language</DataListCell>
          <DataListCell
            cols={4}
          >{`${details?.ContactLanguage}`}</DataListCell>
        </DataListRow>
        <DataListRow>
          <DataListCell cols={4}>Mail Type</DataListCell>
          <DataListCell cols={4}>{`${details?.MailType}`}</DataListCell>
        </DataListRow>
        <DataListRow>
          <DataListCell cols={4}>UseCase Description</DataListCell>
          <DataListCell cols={4}>{details?.UseCaseDescription}</DataListCell>
        </DataListRow>
        <DataListRow>
          <DataListCell cols={4}>Website URL</DataListCell>
          <DataListCell cols={4}>{details?.WebsiteURL}</DataListCell>
        </DataListRow>
      </>
    ) : (<p>Account details not found..</p>)
  )
}

function ReviewDetails({ reviewDetails }) {

  return (
    <>
      <DataListRow>
        <DataListCell cols={4}>Case ID</DataListCell>
        <DataListCell
          cols={4}
        >{`${reviewDetails?.CaseId}`}</DataListCell>
      </DataListRow>
      <DataListRow>
        <DataListCell cols={4}>Status</DataListCell>
        <DataListCell
          cols={4}
        >{`${reviewDetails?.Status}`}</DataListCell>
      </DataListRow>
    </>
  )
}

function SendQuota({ quota }) {

  return (
    quota && (
      <>
        <DataListRow>
          <DataListCell cols={4}>Max 24 Hour Send</DataListCell>
          <DataListCell cols={4}>{quota.Max24HourSend}</DataListCell>
        </DataListRow>
        <DataListRow>
          <DataListCell cols={4}>Max Send Rate</DataListCell>
          <DataListCell cols={4}>{quota.MaxSendRate}</DataListCell>
        </DataListRow>
        <DataListRow>
          <DataListCell cols={4}>Sent Last 24 Hours</DataListCell>
          <DataListCell cols={4}>{quota.SentLast24Hours}</DataListCell>
        </DataListRow>
      </>
    )
  )
}

function SuppressedReasons({ accountData }) {
  const attributes = accountData.SuppressionAttributes;
  console.log(attributes)
  return (
    attributes?.SuppressedReasons &&
    (
      attributes?.SuppressedReasons.map(
        (reason) => (<DataListCell cols={4} key={reason} > {`${reason}`}</DataListCell >)
      )
    )
  )
}

function Info() {
  // const [isLoading, setIsLoading] = useState(false);
  const [accountData, setAccountData] = useState({});
  const [details, setDetails] = useState({});
  const [sendQuota, setSendQuota] = useState({});

  const reviewDetails = accountData?.Details?.ReviewDetails;

  useEffect(
    function () {
      setAccountData(JSON.parse(JSON.stringify(rawdata)));
    },
    [rawdata]
  );

  useEffect(function () {
    setDetails(JSON.parse(JSON.stringify(accountData)).Details);
    setSendQuota(JSON.parse(JSON.stringify(accountData)).SendQuota);
  }, [accountData]);

  console.log("AccountData")
  console.log(accountData);

  return (
    accountData ? (
      <ContentArea>
        <ContentAreaHeading heading="Information" />
        <DataList>
          <DataListRow>
            <DataListCell cols={4}>Dedicated IP Auto Warmup Enabled</DataListCell>
            <DataListCell cols={4}>
              {accountData?.DedicatedIpAutoWarmupEnabled ? "✅" : "❌"}
            </DataListCell>
          </DataListRow>

          <AccountDetails details={details} />
          <SendQuota quota={sendQuota} />
          <ReviewDetails reviewDetails={reviewDetails} />
          <DataListRow>
            <DataListCell cols={4}>Enforcement Status</DataListCell>
            <DataListCell cols={4}>{accountData.EnforcementStatus}</DataListCell>
          </DataListRow>
          <DataListRow>
            <DataListCell cols={4}>SendingEnabled</DataListCell>
            {/* <DataListCell cols={4}>{`${accountData.SendingEnabled}`}</DataListCell> */}
            <DataListCell cols={4}>{accountData.SendingEnabled ? "✅" : "❌"}</DataListCell>
          </DataListRow>
          <DataListRow>
            <DataListCell cols={4}>ProductionAccessEnabled </DataListCell>
            <DataListCell cols={4}> {accountData.ProductionAccessEnabled ? "✅" : "❌"}</DataListCell>
          </DataListRow>
          <DataListRow>
            <DataListCell cols={4}>SuppressedReasons</DataListCell>
            <SuppressedReasons accountData={accountData} />
          </DataListRow>
        </DataList>
      </ContentArea>
    ) : (
      <p>Data is loading ..... </p>
    )

  );
}

export default Info;
