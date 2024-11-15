import { useEffect, useMemo, useContext } from "react";
import { useDispatch } from "react-redux";
import Cookie from "universal-cookie";
import { Outlet } from "react-router-dom";
import { useRecreateTokenMutation, setCredentials } from "../../store";
import { Backdrop, CircularProgress } from "@mui/material";
import SnackbarsContext from "../../context/snackbars";

function LoginLayout() {
  const [recreateToken, { isSuccess, isError }] = useRecreateTokenMutation();
  const { handleEnqueueSnackbar } = useContext(SnackbarsContext);
  const dispatch = useDispatch();

  const cookie = useMemo(() => new Cookie(), []);

  useEffect(() => {
    const refreshLogin = async () => {
      try {
        if (cookie.get("LoggedIn")) {
          const userData = await recreateToken().unwrap();
          dispatch(setCredentials({ ...userData }));
        }
      } catch (err) {
        handleEnqueueSnackbar("Сталася помилка при авторизації!", "error");
      }
    };

    refreshLogin();
  }, [recreateToken, dispatch, cookie, handleEnqueueSnackbar]);

  return (
    <div className="font-serif h-full">
      {(cookie.get("LoggedIn") ? isSuccess || isError : true) ? (
        <Outlet />
      ) : (
        <Backdrop open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </div>
  );
}

export default LoginLayout;
