import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import Cookie from "universal-cookie";
import { Outlet } from "react-router-dom";
import { useRecreateTokenMutation, setCredentials } from "../../store";

function LoginLayout() {
  const [recreateToken, { isSuccess }] = useRecreateTokenMutation();
  const dispatch = useDispatch();

  let outlet = <div>Loading...</div>;
  const cookie = useMemo(() => new Cookie(), []);

  useEffect(() => {
    const refreshLogin = async () => {
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
  }, [recreateToken, dispatch, cookie]);

  if (cookie.get("LoggedIn") ? isSuccess : true) outlet = <Outlet />;
  return (
    <div className="font-serif h-full">
      {outlet}
    </div>
  );
}

export default LoginLayout;