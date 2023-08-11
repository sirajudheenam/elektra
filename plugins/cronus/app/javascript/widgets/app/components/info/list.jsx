// import { Link } from "react-router-dom";
// import { policy } from "lib/policy";
// import { SearchField } from "lib/components/search_field";
// import CredentialItem from "./item";
// import apiClient from "../../apiClient";
// import { createAjaxHelper } from "lib/ajax_helper";
// import { ajaxHelper } from "lib/ajax_helper";
// import { useGlobalState } from "../StateProvider";
// import Item from './item';
import {
  DataList,
  DataListRow,
  DataListCell,
  ContentArea,
  ContentAreaHeading,
} from 'juno-ui-components';
import React, { useEffect, useState } from 'react';

import rawdata from '../../data/awsAccount.json';

function Info() {
  const [accountData, setAccountData] = useState({});

  useEffect(
    function () {
      setAccountData(JSON.parse(JSON.stringify(rawdata)));
    },
    [rawdata]
  );

  console.log(accountData);
  return (
    <>
      <ContentArea>
        <ContentAreaHeading heading="Information" />
        <DataList>
          <DataListRow>
            <DataListCell cols={4}>DedicatedIpAutoWarmupEnabled</DataListCell>
            <DataListCell cols={4}>
              {`${accountData.DedicatedIpAutoWarmupEnabled}`}
            </DataListCell>
          </DataListRow>
          <DataListRow> Details</DataListRow>
          <DataListRow>
            <DataListCell cols={4}>
              AdditionalContactEmailAddresses
            </DataListCell>
            <DataListCell cols={4}>
              {`${accountData.AdditionalContactEmailAddresses}`}
            </DataListCell>
          </DataListRow>
          <DataListRow>
            <DataListCell cols={4}>ContactLanguage</DataListCell>
            <DataListCell
              cols={4}
            >{`${accountData.ContactLanguage}`}</DataListCell>
          </DataListRow>
          <DataListRow>
            <DataListCell cols={4}>MailType</DataListCell>
            <DataListCell cols={4}>{`${accountData.MailType}`}</DataListCell>
          </DataListRow>
          <DataListRow>ReviewDetails</DataListRow>
          <DataListRow>
            <DataListCell cols={4}>CaseId</DataListCell>
            <DataListCell
              cols={4}
            >{`${accountData.ReviewDetails.CaseId}`}</DataListCell>
          </DataListRow>
          <DataListRow>
            <DataListCell cols={4}>Status</DataListCell>
            <DataListCell
              cols={4}
            >{`${accountData.ReviewDetails.Status}`}</DataListCell>
          </DataListRow>
          <DataListRow>
            <DataListCell cols={4}>UseCaseDescription</DataListCell>
            <DataListCell cols={4}>VALUE</DataListCell>
          </DataListRow>
          <DataListRow>
            <DataListCell cols={4}>WebsiteURL</DataListCell>
            <DataListCell cols={4}>VALUE</DataListCell>
          </DataListRow>
          <DataListRow>
            <DataListCell cols={4}>EnforcementStatus</DataListCell>
            <DataListCell cols={4}>HEALTHY</DataListCell>
          </DataListRow>
          <DataListRow>
            <DataListCell cols={4}>ProductionAccessEnabled</DataListCell>
            <DataListCell cols={4}>true</DataListCell>
          </DataListRow>
          <DataListRow>SendQuota</DataListRow>
          <DataListRow>
            <DataListCell cols={4}>Max24HourSend</DataListCell>
            <DataListCell cols={4}>50000</DataListCell>
          </DataListRow>
          <DataListRow>
            <DataListCell cols={4}>MaxSendRate</DataListCell>
            <DataListCell cols={4}>14</DataListCell>
          </DataListRow>
          <DataListRow>
            <DataListCell cols={4}>SentLast24Hours</DataListCell>
            <DataListCell cols={4}>0</DataListCell>
          </DataListRow>
          <DataListRow>
            <DataListCell cols={4}>SendingEnabled</DataListCell>
            <DataListCell cols={4}>true</DataListCell>
          </DataListRow>
          <DataListRow>SuppressionAttributes</DataListRow>
          <DataListRow>
            <DataListCell cols={4}>SuppressedReasons</DataListCell>
            <DataListCell cols={4}>COMPLAINT</DataListCell>
          </DataListRow>
        </DataList>
      </ContentArea>
    </>
  );
}

export default Info;
