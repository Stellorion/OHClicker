// Waits until the backend finished its start-up work (backend-src/startup.rs).
// Without this the first `invoke` calls can arrive while the backend is still
// starting and would read default values instead of the saved options.
import { clickerService } from "../services/clickerService";

/** Polls every 50 ms, for at most ~10 s. Never throws (a broken check must not block the app). */
export const waitForBackend = async (): Promise<void> => {
  for (let attempt = 0; attempt < 200; attempt++) {
    try {
      if (await clickerService.isBackendReady()) return;
    } catch {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
};
