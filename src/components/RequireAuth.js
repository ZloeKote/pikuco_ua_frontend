import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../store";

const RequireAuth = () => {
  const token = useSelector(selectCurrentToken);
  return token ? <Outlet /> : <div>bad...</div>;
};

export default RequireAuth;
