import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { policy } from 'lib/policy';
import { SearchField } from 'lib/components/search_field';
import CredentialItem from './item';
// import apiClient from "../../apiClient";
// import { createAjaxHelper } from "lib/ajax_helper";
import { ajaxHelper } from 'lib/ajax_helper';
import { useGlobalState } from '../StateProvider';

import {
  Button,
  DataGrid,
  DataGridRow,
  DataGridCell,
  DataGridHeadCell,
  DataGridToolbar,
  Spinner,
} from 'juno-ui-components';

import credentials from '../../data/credentials.json';

const EC2Credentials = () => {
  const [filterTerm, setFilterTerm] = React.useState(null);
  const [ec2credentials, setEc2Credentials] = useState(null);
  const items = credentials.credentials;

  console.log(items);
  console.log(typeof items, items?.length);
  console.log(`items[0].access : ${items[0].access}`);
  // const [{ ec2credentials: ec2credentialsState }, dispatch] = useGlobalState();
  const mounted = React.useRef(false);

  React.useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);
  React.useEffect(() => {
    console.log(`credentials: ${items}`);
    setEc2Credentials(items);
  }, []);

  const handleDelete = (access) => {
    setEc2Credentials(ec2credentials.filter((cred) => cred.access === !access));
  };

  return (
    <>
      <DataGridToolbar
        search={
          <SearchField
            variant="juno"
            onChange={setFilterTerm}
            placeholder="name or description"
            text="Searches by name or description in visible ec2credentials list only.
                Entering a search term will automatically start loading the next pages
                and filter the loaded items using the search term. Emptying the search
                input field will show all currently loaded items."
          />
        }
      >
        {/* {policy.isAllowed("cronus:entry_create") && (
          <Link to="/ec2credentials/new">
            <Button>Create new</Button>
          </Link>
        )} */}
      </DataGridToolbar>

      {!policy.isAllowed('cronus:entry_list') ? (
        <span>You are not allowed to see this page</span>
      ) : (
        <DataGrid columns={3} minContentColumns={[2]}>
          <DataGridRow>
            <DataGridHeadCell>Access</DataGridHeadCell>
            <DataGridHeadCell>Key</DataGridHeadCell>
            <DataGridHeadCell></DataGridHeadCell>
          </DataGridRow>
          {ec2credentials && ec2credentials.length > 0 ? (
            ec2credentials.map((ec2credential, index) => (
              <CredentialItem
                key={index}
                ec2credential={ec2credential}
                handleDelete={handleDelete}
              />
            ))
          ) : (
            <DataGridRow>
              <DataGridCell colSpan={3}>No ec2credentials found.</DataGridCell>
            </DataGridRow>
          )}
        </DataGrid>
      )}
    </>
  );
};

export default EC2Credentials;
