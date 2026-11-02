import { useAC } from "./useAC";
import type { ChoiceOption } from "../components/common/ChoiceGroup";
import type { ACPositionMode, ACSequencePoint } from "../types/ac-types";

export type SequencePoint = ACSequencePoint;

const POSITION_MODE_OPTIONS: ChoiceOption<ACPositionMode>[] = [
  { id: "cursor", label: "Cursor" },
  { id: "fixed", label: "Fixed point" },
  { id: "sequence", label: "Sequence" },
];

export const usePosition = () => {
  const { settings, updateSettings } = useAC();

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
  };
};