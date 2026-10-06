import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource-variable/manrope";
import "@fontsource-variable/noto-sans-kr";
import "./styles.css";
import "./marketing.css";
import App from "./App";
import { LanguageProvider } from "./i18n";
import "./international.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>,
);
