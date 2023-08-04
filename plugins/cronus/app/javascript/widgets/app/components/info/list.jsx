// import { Link } from "react-router-dom";
// import { policy } from "lib/policy";
// import { SearchField } from "lib/components/search_field";
// import CredentialItem from "./item";
// import apiClient from "../../apiClient";
// import { createAjaxHelper } from "lib/ajax_helper";
// import { ajaxHelper } from "lib/ajax_helper";
// import { useGlobalState } from "../StateProvider";

import {
  Button,
  DataGrid,
  DataGridRow,
  DataGridCell,
  DataGridHeadCell,
  DataGridToolbar,
  Spinner,
  DataList,
  DataListRow,
  DataListCell,
  ContentArea,
  ContentAreaHeading,
} from "juno-ui-components";
import React, { useEffect, useState } from "react";

// import data from "./awsAccount.json";

const rawdata = {
  DedicatedIpAutoWarmupEnabled: true,
  Details: {
    AdditionalContactEmailAddresses: "VALUE",
    ContactLanguage: "EN",
    MailType: "TRANSACTIONAL",
    ReviewDetails: {
      CaseId: "8148802141",
      Status: "GRANTED",
    },
    UseCaseDescription: "VALUE",
    WebsiteURL: "VALUE",
  },
  EnforcementStatus: "HEALTHY",
  ProductionAccessEnabled: true,
  SendQuota: {
    Max24HourSend: 50000,
    MaxSendRate: 14,
    SentLast24Hours: 0,
  },
  SendingEnabled: true,
  SuppressionAttributes: {
    SuppressedReasons: ["COMPLAINT"],
  },
};

// function parseData(data) {
//   const jsonData = JSON.stringify(data);
//   console.log(jsonData.constructor.name);
//   const parsedJson = JSON.parse(jsonData);
//   let arr = [];
//   let toplevel, innerKeys;
//   let tempObj = {};
//   const keys = Object.keys(parsedJson);
//   keys.forEach((key) => {
//     toplevel = parsedJson[key];
//     if (typeof toplevel !== "object") {
//       let quotedKey = quote(key);
//       tempObj = { [quotedKey]: parsedJson[key] };
//       arr.push(tempObj);
//     } else {
//       innerKeys = Object.keys(toplevel);
//       innerKeys.forEach((innerKey) => {
//         let quotedKey = quote(innerKey);
//         if (typeof innerKeys[innerKey] !== "object") {
//           tempObj = { [quotedKey]: toplevel[innerKey] };
//           arr.push(tempObj);
//         }
//       });
//     }
//   });
//   return arr;
// }

const Info = () => {
  // const items = parseData(rawdata);
  // console.log(typeof items);
  // console.log(items);
  return (
    <>
      <ContentArea>
        <ContentAreaHeading heading="Information" />
        <DataList>
          <DataListRow>
            <DataListCell cols={4}>DedicatedIpAutoWarmupEnabled</DataListCell>
            <DataListCell cols={1}>true</DataListCell>
          </DataListRow>
          <DataListRow> Details</DataListRow>
          <DataListRow>
            <DataListCell cols={4}>
              AdditionalContactEmailAddresses
            </DataListCell>
            <DataListCell cols={4}>info@example.com</DataListCell>
          </DataListRow>
          <DataListRow>
            <DataListCell cols={4}>ContactLanguage</DataListCell>
            <DataListCell cols={4}>EN</DataListCell>
          </DataListRow>
          <DataListRow>
            <DataListCell cols={4}>MailType</DataListCell>
            <DataListCell cols={4}>TRANSACTIONAL</DataListCell>
          </DataListRow>
          <DataListRow>ReviewDetails</DataListRow>
          <DataListRow>
            ReviewDetails
            <DataListCell cols={4}>CaseId</DataListCell>
            <DataListCell cols={4}>8148802141</DataListCell>
          </DataListRow>
          <DataListRow>
            <DataListCell cols={4}>Status</DataListCell>
            <DataListCell cols={4}>GRANTED</DataListCell>
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
};

export default Info;
