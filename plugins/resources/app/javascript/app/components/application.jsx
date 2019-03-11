/* eslint no-console:0 */
import { HashRouter, Route, Redirect } from 'react-router-dom'

import Loader from '../containers/loader';
import Overview from '../containers/overview';
import ProjectEditModal from '../containers/project/edit';
import ProjectSettingsModal from '../containers/project/settings';

const routesForProjectLevel = (props) => {
  const { domainId, projectId, flavorData, docsUrl, canEdit } = props;
  const scopeData = { domainID: domainId, projectID: projectId };
  const rootProps = { flavorData, scopeData };

  return <Loader scopeData={scopeData}>
    <HashRouter>
      <div>
        <Route path="/" render={(props) => <Overview {...rootProps} {...props} canEdit={canEdit} /> }/>

        { canEdit &&
          <Route exact path="/edit/:categoryName" render={(props) => <ProjectEditModal {...rootProps} {...props} /> }/>
        }
        { canEdit &&
          <Route exact path="/settings" render={(props) => <ProjectSettingsModal {...rootProps} {...props} docsUrl={docsUrl} /> }/>
        }
      </div>
    </HashRouter>
  </Loader>;
}

const routesForDomainLevel = (props) => (<p>TODO: domain level</p>);
const routesForClusterLevel = (props) => (<p>TODO: cluster level</p>);

export default (props) => {
  return props.projectId ? routesForProjectLevel(props)
       : props.domainId  ? routesForDomainLevel(props)
       :                   routesForClusterLevel(props);
}
