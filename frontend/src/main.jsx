import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { LoadScript } from "@react-google-maps/api";
import { store } from "./store/store";
import App from "./App.jsx";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}
        libraries={["places"]}
      >
        <App />
      </LoadScript>
    </BrowserRouter>
  </Provider>
);
