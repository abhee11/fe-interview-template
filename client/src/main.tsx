/// <reference types="vite/client" />
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

async function start() {
  const Viewer = import.meta.env.DEV && new URLSearchParams(location.search).has('fixture')
    ? (await import('./dev/PerformanceHarness')).default : App;
  ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><Viewer/></React.StrictMode>);
}
void start();
