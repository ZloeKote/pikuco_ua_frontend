import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import MainPage from "./pages/MainPage";
import QuizzesPage from "./pages/QuizzesPage";
import ErrorPage from "./pages/ErrorPage";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "/content",
        element: <QuizzesPage />,
      },
      {
        path: "/about",
        element: <div>About</div>,
      },
      {
        path: "/contacts",
        element: <div>Contacts</div>,
      },
    ],
  },
]);

export default Router;
