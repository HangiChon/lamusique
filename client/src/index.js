import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

// context
import { SpotifyApiProvider } from "./context/SpotifyApiContext";
import { CurrentTrackProvider } from "./context/CurrentTrackContext";

// auth
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.render(
  <Auth0Provider
    domain={process.env.REACT_APP_DOMAIN}
    clientId={process.env.REACT_APP_0AUTH_CLIENT_ID}
    redirectUri='http://localhost:3000/main'
    audience={`https://${process.env.REACT_APP_DOMAIN}/api/v2/`}
    scope='read:current_user update:current_user_metadata'
  >
    <SpotifyApiProvider>
      <CurrentTrackProvider>
        <App />
      </CurrentTrackProvider>
    </SpotifyApiProvider>
  </Auth0Provider>,
  document.getElementById("root")
);
