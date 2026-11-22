// Payloads of the events the backend emits (listened to in hooks/ac/useBackendEvents.ts).

/** Payload of `position-picked` (backend: clicker/overlay/pick.rs). */
export interface PickedPoint {
  x: number;
  y: number;
  pointId?: string | null;
}
