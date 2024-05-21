import { createContext } from "react";
import { useSnackbar } from "notistack";

const SnackbarsContext = createContext();

function Provider({ children }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleEnqueueSnackbar = (message, variant, hideIcon) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(message, { variant, hideIconVariant: hideIcon });
  };

  const closeAllSnackbars = () => closeSnackbar();

  const closeSnackbarByKey = (key) => closeSnackbar(key);

  const enqueueSnackbarToShare = {
    handleEnqueueSnackbar,
    closeAllSnackbars,
    closeSnackbarByKey
  };

  return <SnackbarsContext.Provider value={enqueueSnackbarToShare}>{children}</SnackbarsContext.Provider>;
}

export { Provider };
export default SnackbarsContext;
