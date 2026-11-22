// Entry point. One bundle serves several windows, chosen by the URL query:
//   ?boundary-overlay  -> BoundaryOverlay     ?position-overlay -> PositionOverlay
//   ?status-indicator  -> StatusIndicator     ?status-toast     -> StatusToast
//   (none)             -> App (the main window)
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { PositionOverlay } from "./components/overlay/PositionOverlay.tsx";
import { BoundaryOverlay } from "./components/overlay/BoundaryOverlay.tsx";
import { StatusIndicator } from "./components/overlay/StatusIndicator.tsx";
import { StatusToast } from "./components/overlay/StatusToast.tsx";

const params = new URLSearchParams(window.location.search);

/** Which page this window shows (see the list above). */
const pickRoot = () => {
  if (params.has("boundary-overlay")) return <BoundaryOverlay />;
  if (params.has("position-overlay")) return <PositionOverlay />;
  if (params.has("status-indicator")) return <StatusIndicator />;
  if (params.has("status-toast")) return <StatusToast />;
  return <App />;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>{pickRoot()}</StrictMode>,
);
