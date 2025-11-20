import React from "react";
import { createRoot } from "react-dom/client";
import LandingPage from "../js/pages/landing/LandingPage";
import "../css/app.css";

const rootElement = document.getElementById("landing-root");
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<LandingPage />);
}