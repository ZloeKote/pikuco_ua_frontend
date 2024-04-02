import { useLocation, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../store";

const RequireAuth = () => {
  const token = useSelector(selectCurrentToken);
  const location = useLocation();

  return (
    token  
    ? <Outlet />
    : <div>bad...</div>
    // <Navigate to="/login" state={{from:location}} replace />
    )
}

export default RequireAuth;