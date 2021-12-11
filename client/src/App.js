import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// import components
import Header from "./components/Header";
import Home from "./components/Home";
import Main from "./components/Main";

// auth
import { useAuth0 } from "@auth0/auth0-react";

// visual
import GlobalStyles from "./components/GlobalStyles";

const App = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <Router>
      <GlobalStyles />
      <Header />
      <Switch>
        <Route exact path='/' component={Home} />
        {isAuthenticated && <Route exact path='/main' component={Main} />}
      </Switch>
    </Router>
  );
};

export default App;
// "start": "concurrently \"yarn start:client\" \"cd ../server && yarn start:server\"",
