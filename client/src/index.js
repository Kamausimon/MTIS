import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "./components/themeContext";
import "./index.css";
import App from "./App";
import dotenv from "dotenv";

dotenv.config();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>, document.getElementById("root")
);
