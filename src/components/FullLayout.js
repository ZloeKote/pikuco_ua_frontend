import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Cookie from "universal-cookie";
import { Outlet } from "react-router-dom";
import NavigationPanel from "./NavigationPanel";
import Footer from "./Footer";

import { useRecreateTokenMutation, setCredentials } from "../store";

function FullLayout() {
  const [recreateToken, { isLoading }] = useRecreateTokenMutation();
  const dispatch = useDispatch();

  let outlet = <div>Loading...</div>;
  useEffect(() => {
    const refreshLogin = async () => {
      const cookie = new Cookie();
      try {
        if (cookie.get("LoggedIn")) {
          const userData = await recreateToken().unwrap();
          dispatch(setCredentials({ ...userData }));
        }
      } catch (err) {
        return;
      }
    };
    refreshLogin();
  }, [recreateToken, dispatch]);

  if (!isLoading) outlet = <Outlet />;

  return (
    <div className="layout font-serif">
      <NavigationPanel />
      {outlet}
      <Footer />
    </div>
  );
}

export default FullLayout;
