import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import store from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <ConfigProvider
      theme={{ token: { fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" } }}
    >
      <App />
    </ConfigProvider>
  </Provider>,
);
