import React from "react";
import { Route, Redirect } from "react-router-dom";

// auth
import { useAuth0 } from "@auth0/auth0-react";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuth0();
  console.log(isAuthenticated);
  return (
    <Route
      {...rest}
      render={props => {
        if (isAuthenticated) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/",
                state: { from: props.location }
              }}
            />
          );
        }
      }}
    />
  );
};

export default ProtectedRoute;
