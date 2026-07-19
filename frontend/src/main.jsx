import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "./index.css";
import { DashboardProvider } from "./context/DashboardContext";
import App from "./App";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./context/AuthContext";
import { UIProvider } from "./context/UIContext";

ReactDOM.createRoot(document.getElementById("root")).render(
 <React.StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <DashboardProvider>
        <UIProvider>

          <Toaster
            position="top-right"
          />

          <App />

        </UIProvider>
      </DashboardProvider>
    </AuthProvider>
  </BrowserRouter>
</React.StrictMode>
    
);