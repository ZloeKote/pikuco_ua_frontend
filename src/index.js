import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";
import { Provider as SearchParamsProvider } from "./context/searchParams";

const el = document.getElementById("root");
const root = ReactDOM.createRoot(el);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <SearchParamsProvider>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </SearchParamsProvider>
    </BrowserRouter>
  </Provider>
);