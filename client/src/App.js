import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// import components
import Header from "./components/Header";
import Home from "./components/Home";
import Main from "./components/Main";

// context
import { CategoryProvider } from "./context/CategoryContext";
import { TracksProvider } from "./context/TracksContext";

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
        {isAuthenticated && (
          <CategoryProvider>
            <TracksProvider>
              <Route exact path='/main' component={Main} />
            </TracksProvider>
          </CategoryProvider>
        )}
      </Switch>
    </Router>
  );
};

export default App;
// "start": "concurrently \"yarn start:client\" \"cd ../server && yarn start:server\"",
