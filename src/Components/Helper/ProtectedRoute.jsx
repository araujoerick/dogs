import React from "react";
import { UserContext } from "../../UserContext";
import { Navigate } from "react-router-dom";

// Verifica se está logado. Se true passa o children que é o que está detro do
// componente <ProtectedRoute><ComponenteFilho/></ProtectedRoute>
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = React.useContext(UserContext);
  if (isLoggedIn === true) {
    return children;
  } else if (isLoggedIn === false) {
    return <Navigate to="/login" />;
  } else {
    return <></>;
  }
};

export default ProtectedRoute;
