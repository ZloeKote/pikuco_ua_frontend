import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../store";
import NotAuthorized from "./errors/NotAuthorized";
import NavigationPanel from "./NavigationPanel";
import Footer from "./Footer";

const RequireAuth = () => {
  const token = useSelector(selectCurrentToken);
  return token ? (
    <Outlet />
  ) : (
    <div className="full-layout">
      <NavigationPanel />
      <NotAuthorized />
      <Footer />
    </div>
  );
};

export default RequireAuth;
