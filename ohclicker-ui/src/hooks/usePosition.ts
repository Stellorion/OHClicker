import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { useAC } from "./useAC";
import type { ChoiceOption } from "../components/common/ChoiceGroup";
import type { ACPositionMode, ACSequencePoint } from "../types/ac-types";
import { clickerService } from "../services/clickerService";

export type SequencePoint = ACSequencePoint;

const POSITION_MODE_OPTIONS: ChoiceOption<ACPositionMode>[] = [
  { id: "cursor", label: "Cursor" },
  { id: "fixed", label: "Fixed point" },
  { id: "sequence", label: "Sequence" },
];

export const usePosition = () => {
  const { settings, updateSettings } = useAC();
  const [isPicking, setIsPicking] = useState(false);
  const [pickingPointId, setPickingPointId] = useState<string | null>(null);

  useEffect(() => {
    let unlistenArmed: (() => void) | undefined;
    let unlistenPicked: (() => void) | undefined;
    let unlistenCancelled: (() => void) | undefined;
    void listen<string | null>("position-pick-armed", (event) => {
      setIsPicking(true);
      setPickingPointId(event.payload ?? null);
    }).then((stop) => {
      unlistenArmed = stop;
    });
    void listen("position-picked", () => {
      setIsPicking(false);
      setPickingPointId(null);
    }).then((stop) => {
      unlistenPicked = stop;
    });
    void listen("position-pick-cancelled", () => {
      setIsPicking(false);
      setPickingPointId(null);
    }).then((stop) => {
      unlistenCancelled = stop;
    });
    void clickerService.getPositionOverlayState().then((state) => {
      setIsPicking(state.picking);
      setPickingPointId(state.picking ? (state.pickPointId ?? null) : null);
    }).catch(() => undefined);
    return () => {
      unlistenArmed?.();
      unlistenPicked?.();
      unlistenCancelled?.();
    };
  }, []);

  const sequencePoints: ACSequencePoint[] = settings.sequencePoints ?? [
    { id: "1", x: 412, y: 288, dwell: 40 },
    { id: "2", x: 1280, y: 420, dwell: 40 },
    { id: "3", x: 960, y: 780, dwell: 120 },
  ];

  const addSequencePoint = () => {
    const newPoint: ACSequencePoint = {
      id: Date.now().toString(),
      x: 0,
      y: 0,
      dwell: 50,
    };
    updateSettings({ sequencePoints: [...sequencePoints, newPoint] });
  };

  const updateSequencePoint = (id: string, fields: Partial<ACSequencePoint>) => {
    const updated = sequencePoints.map((pt) =>
      pt.id === id ? { ...pt, ...fields } : pt
    );
    updateSettings({ sequencePoints: updated });
  };

  const removeSequencePoint = (id: string) => {
    const filtered = sequencePoints.filter((pt) => pt.id !== id);
    updateSettings({ sequencePoints: filtered });
  };

  const beginPositionPick = async () => {
    await clickerService.beginPositionPick();
    setIsPicking(true);
  };

  const beginSequencePointPick = async (pointId: string) => {
    await clickerService.beginPositionPick(pointId);
    setIsPicking(true);
    setPickingPointId(pointId);
  };

  return {
    positionMode: settings.positionMode ?? "fixed",
    x: settings.targetX ?? 1207,
    y: settings.targetY ?? 477,
    jitter: settings.positionJitterPx ?? 2,
    sequencePoints,
    positionModeOptions: POSITION_MODE_OPTIONS,
    updateSettings,
    addSequencePoint,
    updateSequencePoint,
    removeSequencePoint,
    beginPositionPick,
    beginSequencePointPick,
    isPicking,
    pickingPointId,
  };
};