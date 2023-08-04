import moment from "moment";
import * as constants from "../constants";
import { ajaxHelper } from "lib/ajax_helper";
import { confirm } from "lib/dialogs";
import { addNotice, addError } from "lib/flashes";
import { isEmpty } from "lib/tools/helpers";
import { ErrorsList } from "lib/elektra-form/components/errors_list";
import React from "react";

//#################### EC2CREDENTIALS #########################

const requestEC2Credentials = () => ({
  type: constants.REQUEST_EC2CREDENTIALS,
});

const requestEC2CredentialsFailure = (error) => ({
  type: constants.REQUEST_EC2CREDENTIALS_FAILURE,
  error,
});

const receiveEC2Credentials = (json, total) => ({
  type: constants.RECEIVE_EC2CREDENTIALS,
  ec2credentials: json,
  total,
});

const loadEC2Credentials = () => (dispatch, getState) => {
  const currentState = getState();
  const ec2credentials = currentState.ec2credentials;
  const limit = ec2credentials.limit;
  const offset = ec2credentials.offset || 0;
  const isFetching = ec2credentials.isFetching;

  // don't fetch if we're already fetching
  if (isFetching) return;
  dispatch(requestEC2Credentials());

  return ajaxHelper
    .get("/ec2credentials", { params: params })
    .then((response) => {
      if (response.data.errors) {
        addError(
          React.createElement(ErrorsList, { errors: response.data.errors })
        );
      } else {
        dispatch(
          receiveEC2Credentials(
            response.data.ec2credentials,
            response.data.total
          )
        );
      }
    })
    .catch((error) => {
      dispatch(requestEC2CredentialsFailure(error.message));
      addError(`Could not load ec2credentials (${error.message})`);
    });
};
export const fetchEC2Credentials = (offset) =>
  function (dispatch, getState) {
    const currentState = getState();
    const ec2credentials = currentState.ec2credentials;
    const limit = ec2credentials.limit;
    const currentPageCalc = offset > 0 ? offset / limit + 1 : 1;

    dispatch(updateOffset(offset));
    dispatch(updateCurrentPage(currentPageCalc));
    dispatch(loadEC2Credentials());
  };

const updateOffset = (offset) => ({ type: constants.UPDATE_OFFSET, offset });

const updateCurrentPage = (page) => ({
  type: constants.UPDATE_CURRENT_PAGE,
  page: page,
});

// ----------- PAGINATE -----------
export function paginate(page) {
  return (dispatch, getState) => {
    const currentState = getState();
    const ec2credentials = currentState.ec2credentials;
    const limit = ec2credentials.limit;
    const offsetCalc = (page - 1) * limit;

    dispatch(updateOffset(offsetCalc));
    dispatch(updateCurrentPage(page));
    dispatch(loadEC2Credentials());
  };
}

const loadEC2CredentialDetails = (ec2credential) => (dispatch, getState) => {
  // don't fetch if we're already fetching
  if (ec2credential.isFetchingDetails) return;
  dispatch(requestEC2CredentialDetails(ec2credential));

  return ajaxHelper
    .get(`credentials/OS-EC2/${ec2credential.access}`)
    .then((response) => {
      if (response.data.errors) {
        addError(
          React.createElement(ErrorsList, { errors: response.data.errors })
        );
      } else {
        dispatch(receiveEC2CredentialDetails(ec2credential, response.data));
      }
    })
    .catch((error) => {
      dispatch(
        requestEC2CredentialDetailsFailure(ec2credential, error.message)
      );
      addError(`Could not load ec2credential details (${error.message})`);
    });
};

const requestEC2CredentialDetails = (ec2credential) => ({
  type: constants.REQUEST_EC2CREDENTIAL_DETAILS,
  ec2credentialAccess: ec2credential.access,
});

const requestEC2CredentialDetailsFailure = (ec2credential, error) => ({
  type: constants.REQUEST_EC2CREDENTIALS_FAILURE,
  error: error,
  ec2credentialAccess: ec2credential.access,
});

const receiveEC2CredentialDetails = (ec2credential, json) => ({
  type: constants.RECEIVE_EC2CREDENTIAL_DETAILS,
  ec2credentialDetails: json,
  ec2credentialAccess: ec2credential.access,
});
