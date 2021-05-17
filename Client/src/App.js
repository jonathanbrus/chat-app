import React, { useLayoutEffect } from "react";
import { connect } from "react-redux";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { SIGNIN } from "./Redux/Actions/ActionTypes";
import { signOut } from "./Redux/Actions/ActionCreators";

import AuthPage from "./Pages/AuthPage/AuthPage";
import AppLayout from "./Layout/AppLayout";
import "./App.css";

function App(props) {
  useLayoutEffect(() => {
    const messengerData = localStorage.getItem("messengerData");

    if (messengerData) {
      const { user, accessToken, refreshToken, expireAt } =
        JSON.parse(messengerData);

      const day = new Date();

      if (day.toISOString() > expireAt) {
        props.onSignOut();
      } else {
        props.onPageLoad({
          user: user,
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      {props.User ? (
        <AppLayout />
      ) : (
        <Switch>
          <Route path="/authentication" exact>
            <AuthPage />
          </Route>
          <Redirect from="*" to="/authentication" />
        </Switch>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    User: state.Auth.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onPageLoad: (data) => dispatch({ type: SIGNIN, payLoad: data }),
    onSignOut: (historyProp) => dispatch(signOut(historyProp)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
