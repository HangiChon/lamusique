// import React, { createContext, useState } from "react";

// export const CurrentUserContext = createContext(null);

// export const CurrentUserProvider = ({ children }) => {
//   // const [isAuth, setIsAuth] = useState(false);
//   const [userData, setUserData] = useState(
//     localStorage.getItem("userData")
//       ? JSON.parse(localStorage.getItem("userData"))
//       : null
//   );
//   return (
//     <CurrentUserContext.Provider value={{ userData }}>
//       {children}
//     </CurrentUserContext.Provider>
//   );
// };

// export default CurrentUserProvider;
