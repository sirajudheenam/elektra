import React from "react";
import { Link, useHistory } from "react-router-dom";
import { policy } from "lib/policy";
import {
  Badge,
  ButtonRow,
  Icon,
  DataGridRow,
  DataGridCell,
} from "juno-ui-components";

const Item = ({ ec2credential, handleDelete }) => {
  // manually push a path onto the react router history
  // once we run on react-router-dom v6 this should be replaced with the useNavigate hook, and the push function with a navigate function
  // like this: const navigate = useNavigate(), the use navigate('this/is/the/path') in the onClick handler of the edit button below
  const { push } = useHistory();

  return (
    <DataGridRow className={/*ec2credential.isDeleting ? "updating" : */ ""}>
      <DataGridCell>
        <Link to={`/ec2credentials/${ec2credential.access}/show`}>
          {ec2credential.access}
        </Link>
      </DataGridCell>
      <DataGridCell>{ec2credential.secret}</DataGridCell>
      <DataGridCell nowrap>
        DeleteButton
      </DataGridCell>
    </DataGridRow>
  );
};

export default Item;
