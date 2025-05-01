import "./MasterData.css";
import { Route, Switch, Redirect } from "react-router-dom";
import React from "react";

import PrivateRoute from "../../components/PrivateRoute/PrivateRoute";
import Exception from "../../components/Exception/Exception";
import CampusDetailsList from "./CampusDetailsList";
import CourseDetailsList from "./CourseDetailsList";
import StudentDetailsList from "./StudentDetailsList";
import AddStudent from "../../components/AddStudent/AddStudent";


const Master = () => {
  let user =
    JSON.parse(localStorage.getItem("certificate-automation-authority")) ||
    JSON.parse(sessionStorage.getItem("certificate-automation-authority"));
  return (
    <div className="main-certificates-continer">
      <div style={{ marginTop: 150 }} />
      <Switch>
      <Route
          exact
          path="/master/campus-list"
          component={CampusDetailsList}
        />
        <Route
          exact
          path="/master/course-list"
          component={CourseDetailsList}
        />
        <Route
          exact
          path="/master/student-list"
          component={StudentDetailsList}
        />
        <PrivateRoute path="/master/add-student" component={AddStudent} />
        {user && user.master ? (
          user.master.map((module, index) => (
            <Route
              exact
              path="/master"
              render={() => <Redirect to={module.module_url} />}
              key={index}
            />
          ))
        ) : (
          <Route
            exact
            path="/master"
            render={() => <Redirect to="/master/campus-list" />}
          />
        )}

        <Route component={Exception} />
      </Switch>
    </div>
  );
};

export default Master;
