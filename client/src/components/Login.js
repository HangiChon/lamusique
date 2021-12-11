import React from "react";

// auth
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div>
      <button onClick={() => loginWithRedirect()}>Login with 0Auth</button>
    </div>
  );
};

export default Login;
