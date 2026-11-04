// Entry point. One bundle serves three windows, chosen by the URL query:
//   ?boundary-overlay -> BoundaryOverlay   ?position-overlay -> PositionOverlay   (none) -> App
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { PositionOverlay } from "./components/overlay/PositionOverlay.tsx";
import { BoundaryOverlay } from "./components/overlay/BoundaryOverlay.tsx";

const params = new URLSearchParams(window.location.search);
const root = params.has("boundary-overlay") ? (
  <BoundaryOverlay />
) : params.has("position-overlay") ? (
  <PositionOverlay />
) : (
  <App />
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>{root}</StrictMode>,
);
