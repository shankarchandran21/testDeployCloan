import { Route, Switch } from "react-router-dom";
import React from "react";

import Reports from "./Reports";
import Exception from "../../components/Exception/Exception";
import PrivateRoute from "../../components/PrivateRoute/PrivateRoute";
import SignCertificates from "../../components/Profile/SignCertificates";

const MainReports = () => {
  return (
    <div>
      <div style={{ marginTop: 150 }} />
      <Switch>
        <PrivateRoute
          path="/reports/:id/preview"
          component={SignCertificates}
        />

        <Route exact path="/reports" component={Reports} />

        <Route component={Exception} />
      </Switch>
    </div>
  );
};

export default MainReports;
